import { execSync } from 'child_process';
import fs from 'fs';

try {
    execSync('npx tsc -b', { stdio: 'pipe' });
    console.log('TSC passed');
} catch (e) {
    fs.writeFileSync('tsc_out.txt', e.stdout.toString() + '\\n' + e.stderr.toString());
    console.log('TSC failed, check tsc_out.txt');
}
