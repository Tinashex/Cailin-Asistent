/**

   * WhatsApp bot Cailin Assistant using baileys (@wishkeysocket/baileys)
   * Type plugins  | Modules ESM
   * Creator Mommy kyu
   * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
   * Follow https://whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
   
   ** Dilarang menjual   script ini.*
   
   ** [ID] - Baca file README.md untuk melihat panduan!
   ** [ENG] -  Read the README.md file to see the guide!
   
   ** Copyright (©) Mommy kyu 2026 **
   
**/

import { exec } from 'child_process';
import util from 'util';
import chalk from 'chalk';
import axios from 'axios';

const execAsync = util.promisify(exec);

export async function checkGitHubUpdate() {
  try {
    const repo = 'RynnStecu/Cailin-Asistent';
    const currentVersion = global.version || '2.0.0';

    
    const res = await axios.get(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers: { 'User-Agent': 'Cailin-AutoUpdate-Checker' },
      timeout: 10000
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      const latestCommit = res.data[0];
      const commitSha = latestCommit.sha.slice(0, 7);
      const commitMessage = latestCommit.commit?.message || 'Update baru tersedia';

      
      try {
        await execAsync('git fetch origin main', { timeout: 10000 });
        const { stdout: status } = await execAsync('git status -uno');
        
        if (status.includes('behind')) {
          console.log(chalk.yellow(`\n[📢 UPDATE GITHUB TERSEDIA]`));
          console.log(chalk.cyan(` ├─ Repo    : ${repo}`));
          console.log(chalk.cyan(` ├─ Commit  : ${commitSha}`));
          console.log(chalk.cyan(` ├─ Info    : ${commitMessage.split('\n')[0]}`));
          console.log(chalk.green(` └─ Gunakan 'git pull' untuk memperbarui script.\n`));
          return { available: true, commitSha, commitMessage };
        }
      } catch (_) {
        
        console.log(chalk.cyan(`[GitHub Updater] Local version: v${currentVersion} | Latest Commit: ${commitSha}`));
      }
    }
  } catch (e) {
    console.error(chalk.red('[AutoUpdateChecker] Gagal memeriksa update GitHub:'), e.message);
  }
  return { available: false };
}
