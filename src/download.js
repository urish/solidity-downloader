const fs = require('fs');
const request = require('request');
const ProgressBar = require('progress');
const { basename, join } = require('path');

const outDir = join(__dirname, '../contracts');

async function downloadData(dataset) {
  const bar = new ProgressBar('  downloading [:bar] :current/:total :percent ETA: :etas :name', {
    incomplete: ' ',
    head: '>',
    width: 20,
    total: dataset.length,
  });

  for (const { repo_name, id, ref, path } of dataset) {
    const branch = ref.replace(/.+\//, '');
    const url = `https://raw.githubusercontent.com/${repo_name}/${branch}/${path}`;
    const output = join(outDir, `${repo_name.replace('/', '_')}__${path.replace(/\//g, '_')}`);

    bar.tick({ name: basename(path) });

    await new Promise((resolve) =>
      request(url)
        .pipe(fs.createWriteStream(output))
        .on('finish', resolve),
    );
  }
  console.log('\n');
}

downloadData(require('../data/sol-files.json')).catch((err) => {
  console.error('\n\nFailed!', err, err.stack);
});
