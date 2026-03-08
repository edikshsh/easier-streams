const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGE = path.join(ROOT, 'src-pack');

function copyDirSync(src, dest, excludeDirs = []) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (excludeDirs.includes(entry.name)) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath, excludeDirs);
        } else if (entry.name.endsWith('.ts')) {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

if (fs.existsSync(STAGE)) fs.rmSync(STAGE, { recursive: true });

copyDirSync(path.join(ROOT, 'src'), path.join(STAGE, 'src'), ['tests']);

fs.copyFileSync(path.join(ROOT, 'README.md'), path.join(STAGE, 'README.md'));

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
pkg.main = 'src/index.ts';
delete pkg.types;
delete pkg.scripts;
delete pkg.devDependencies;
fs.writeFileSync(path.join(STAGE, 'package.json'), JSON.stringify(pkg, null, 4));

execSync('npm pack', { cwd: STAGE, stdio: 'inherit' });

const tgz = fs.readdirSync(STAGE).find(f => f.endsWith('.tgz'));
if (tgz) {
    fs.renameSync(path.join(STAGE, tgz), path.join(ROOT, tgz));
    console.log(`Packed: ${tgz}`);
}

fs.rmSync(STAGE, { recursive: true });
