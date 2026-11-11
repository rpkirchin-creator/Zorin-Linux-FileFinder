/**
 * @file commandExplainer.ts
 * @description Deconstructs complex Linux search commands into beginner-friendly
 * interactive visual blocks, translating cryptic switches like '+100M', '-type f',
 * '2>/dev/null', and '-iname' into plain English for students.
 */

export interface CommandToken {
  text: string;
  category: 'tool' | 'path' | 'switch' | 'argument' | 'shield' | 'pipe' | 'action';
  title: string;
  plainEnglish: string;
  whyThisExists: string;
  symbolBreakdown?: string;
}

export interface CommandAnatomy {
  plainEnglishSentence: string;
  tokens: CommandToken[];
}

/**
 * Parses and generates an educational breakdown of a Linux search command.
 */
export function explainCommandAnatomy(commandStr: string, tool: string): CommandAnatomy {
  const tokens: CommandToken[] = [];
  const words = commandStr.split(' ');

  let toolName = words[0];
  let searchTarget = '';
  let sentenceParts: string[] = [];

  sentenceParts.push(`Run **${toolName}**`);

  // Analyze tokens
  let i = 0;
  while (i < words.length) {
    const word = words[i];

    if (i === 0) {
      tokens.push({
        text: word,
        category: 'tool',
        title: 'The Program (Tool)',
        plainEnglish: `Executes the "${word}" search engine`,
        whyThisExists: 'Every terminal command begins with the name of the program to run.',
      });
      i++;
      continue;
    }

    // Shield (2>/dev/null)
    if (word === '2>/dev/null') {
      tokens.push({
        text: word,
        category: 'shield',
        title: 'The Error Shield (Mutes "Permission Denied")',
        plainEnglish: 'Silently throw away all error messages',
        whyThisExists: 'Prevents the terminal from being flooded with hundreds of "Permission denied" warnings from root directories.',
        symbolBreakdown: '• "2" = Error stream (stderr)\n• ">" = Redirect / Send into\n• "/dev/null" = The Linux black hole / trash can',
      });
      sentenceParts.push('while muting any "Permission denied" errors');
      i++;
      continue;
    }

    // Pipe |
    if (word === '|') {
      tokens.push({
        text: word,
        category: 'pipe',
        title: 'The Pipe Operator (|)',
        plainEnglish: 'Feed output directly into the next program',
        whyThisExists: 'Sends the list of files directly into fzf or another utility without saving to a temporary file first.',
      });
      sentenceParts.push('then pipe the results into');
      i++;
      continue;
    }

    // Redirection >
    if (word === '>') {
      tokens.push({
        text: word,
        category: 'action',
        title: 'File Redirection (>)',
        plainEnglish: 'Save output to a text file',
        whyThisExists: 'Writes the search results straight to disk.',
      });
      i++;
      continue;
    }

    // Type switch in fd (-t f, -t d, -t x)
    if (word === '-t' && i + 1 < words.length) {
      const val = words[i + 1];
      const typeName = val === 'f' ? 'Regular Files (not folders)' : val === 'd' ? 'Directories (folders only)' : val === 'x' ? 'Executables (+x programs)' : val;
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: Item Type (-t)',
        plainEnglish: `Only match ${typeName}`,
        whyThisExists: 'Tells the computer whether you are looking for a document/file, or a folder.',
        symbolBreakdown: `• "-t" = Shortcut for "--type"\n• "${val}" = "${val === 'f' ? 'File' : val === 'd' ? 'Directory' : 'eXecutable'}" (f does NOT mean folder!)`,
      });
      sentenceParts.push(`looking only for **${typeName}**`);
      i += 2;
      continue;
    }

    // Type in find (-type f, -type d)
    if (word === '-type' && i + 1 < words.length) {
      const val = words[i + 1];
      const typeName = val === 'f' ? 'Regular Files' : val === 'd' ? 'Folders' : val;
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: File Type (-type)',
        plainEnglish: `Match only ${typeName}`,
        whyThisExists: 'Distinguishes between regular files and directories.',
        symbolBreakdown: `• "-type" = Filter by filesystem node kind\n• "f" = Regular File\n• "d" = Directory\n• (Note: Beginners often think 'f' means 'folder'—in Linux, 'f' means 'file' and 'd' means 'directory')`,
      });
      sentenceParts.push(`filtering for **${typeName}**`);
      i += 2;
      continue;
    }

    // Size switch in fd (-S +100m, -S -10k)
    if (word === '-S' && i + 1 < words.length) {
      const val = words[i + 1];
      const isMore = val.startsWith('+');
      const isLess = val.startsWith('-');
      const cleanVal = val.replace(/^[+-]/, '');
      const desc = isMore ? `Larger than ${cleanVal}` : isLess ? `Smaller than ${cleanVal}` : `Exactly ${cleanVal}`;
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: File Size (-S)',
        plainEnglish: desc,
        whyThisExists: 'Finds heavy files taking up drive space, or tiny config files.',
        symbolBreakdown: `• "-S" = Shortcut for "--size"\n• "${isMore ? '+' : '-'}" = ${isMore ? 'GREATER THAN (Larger)' : 'LESS THAN (Smaller)'}\n• "m" = Megabytes, "k" = Kilobytes, "g" = Gigabytes`,
      });
      sentenceParts.push(`that are **${desc}**`);
      i += 2;
      continue;
    }

    // Size in find (-size +100M)
    if (word === '-size' && i + 1 < words.length) {
      const val = words[i + 1];
      const isMore = val.startsWith('+');
      const isLess = val.startsWith('-');
      const cleanVal = val.replace(/^[+-]/, '');
      const desc = isMore ? `Bigger than ${cleanVal}` : isLess ? `Smaller than ${cleanVal}` : `Exact size ${cleanVal}`;
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: File Size (-size)',
        plainEnglish: desc,
        whyThisExists: 'Filters files by physical byte size on disk.',
        symbolBreakdown: `• "+" = GREATER THAN (Bigger than)\n• "-" = LESS THAN (Smaller than)\n• "M" = Megabytes (Uppercase in find!)\n• "k" = Kilobytes`,
      });
      sentenceParts.push(`with size **${desc}**`);
      i += 2;
      continue;
    }

    // Extension switch in fd (-e txt, -e pdf)
    if (word === '-e' && i + 1 < words.length) {
      const val = words[i + 1];
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: Extension (-e)',
        plainEnglish: `Ends with .${val.replace(/['"]/g, '')}`,
        whyThisExists: 'Restricts the search strictly to specific file formats.',
        symbolBreakdown: `• "-e" = Shortcut for "--extension"\n• Automatically ignores uppercase/lowercase (matches .txt, .TXT)`,
      });
      sentenceParts.push(`with extension **.${val.replace(/['"]/g, '')}**`);
      i += 2;
      continue;
    }

    // Hidden switch (-H / --hidden)
    if (word === '-H' || word === '--hidden') {
      tokens.push({
        text: word,
        category: 'switch',
        title: 'Switch: Include Hidden Files (-H)',
        plainEnglish: 'Include hidden dotfiles (e.g. .bashrc, .config)',
        whyThisExists: 'By default, fd hides dotfiles so you don\'t get overwhelmed. This switch turns them ON.',
        symbolBreakdown: '• "-H" = Shortcut for "--hidden"\n• In Linux, any file starting with a dot "." is considered hidden.',
      });
      sentenceParts.push('including hidden dotfiles');
      i++;
      continue;
    }

    // Readable only switch (-readable)
    if (word === '-readable') {
      tokens.push({
        text: word,
        category: 'switch',
        title: 'Switch: Current User Readable Only (-readable)',
        plainEnglish: 'Only scan files you have permission to open',
        whyThisExists: 'Prevents permissions errors when non-root students search system files.',
        symbolBreakdown: '• "-readable" = Checks your user ID against the file permissions before trying to read it.',
      });
      sentenceParts.push('checking that files are readable by your account');
      i++;
      continue;
    }

    // Changed within (--changed-within 24h)
    if (word === '--changed-within' && i + 1 < words.length) {
      const val = words[i + 1];
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: Time Modified (--changed-within)',
        plainEnglish: `Modified recently (within the last ${val})`,
        whyThisExists: 'Finds files you recently downloaded, edited, or saved.',
        symbolBreakdown: `• "--changed-within" = Checks the file modification timestamp (mtime)\n• "24h" = 24 hours, "7d" = 7 days`,
      });
      sentenceParts.push(`modified within the last **${val}**`);
      i += 2;
      continue;
    }

    // -mtime in find (-mtime -7, -mtime +30)
    if (word === '-mtime' && i + 1 < words.length) {
      const val = words[i + 1];
      const isRecent = val.startsWith('-');
      const days = val.replace(/^[+-]/, '');
      const desc = isRecent ? `Modified within the last ${days} days` : `Older than ${days} days`;
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: 'Switch: Modification Time (-mtime)',
        plainEnglish: desc,
        whyThisExists: 'Finds files based on how many days ago they were touched.',
        symbolBreakdown: `• "-mtime" = Modification time in 24-hour days\n• "-" means LESS than X days ago (recent!)\n• "+" means MORE than X days ago (old!)`,
      });
      sentenceParts.push(`that was **${desc}**`);
      i += 2;
      continue;
    }

    // Name matching in find (-iname "*.pdf", -name "file")
    if ((word === '-iname' || word === '-name') && i + 1 < words.length) {
      const val = words[i + 1];
      const isCaseInsensitive = word === '-iname';
      tokens.push({
        text: `${word} ${val}`,
        category: 'switch',
        title: `Switch: Name Match (${word})`,
        plainEnglish: `File name matches ${val}`,
        whyThisExists: 'Matches the file name against a pattern or wildcard.',
        symbolBreakdown: `• "-name" = Exact case sensitive match\n• "-iname" = The "i" stands for "Insensitive" (ignores uppercase vs lowercase!)\n• "*" = Wildcard meaning "anything"`,
      });
      sentenceParts.push(`named matching **${val}**`);
      i += 2;
      continue;
    }

    // Search path (~ or . or /)
    if (word === '~' || word === '.' || word.startsWith('/') || word.startsWith('~/')) {
      const pathDesc = word === '~' ? 'Home directory (~)' : word === '.' ? 'Current folder (.)' : `Directory "${word}"`;
      tokens.push({
        text: word,
        category: 'path',
        title: 'Search Location (Path)',
        plainEnglish: `Search inside ${pathDesc}`,
        whyThisExists: 'Tells the tool where in the Linux directory tree to begin looking.',
        symbolBreakdown: `• "~" (Tilde) = Your user home (/home/username)\n• "." (Dot) = Current folder you are sitting in\n• "/" (Slash) = Entire drive root`,
      });
      sentenceParts.push(`inside **${pathDesc}**`);
      i++;
      continue;
    }

    // Default token
    tokens.push({
      text: word,
      category: 'argument',
      title: 'Argument',
      plainEnglish: word,
      whyThisExists: 'Parameter passed to the command.',
    });
    i++;
  }

  const plainSentence = sentenceParts.join(' ') + '.';

  return {
    plainEnglishSentence: plainSentence,
    tokens,
  };
}
