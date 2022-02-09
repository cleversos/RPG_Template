First, download the Visual Studio extension "Folder Templates" (it had almost 10k downloads as of this writing).

Copy the "Enemy-Template" folder into Folder Templates template folder by following these instructions:
  1) copy "Open Global Folder Templates Directory"
  2) press CTRL + SHIFT + P to open Visual Studio's command palette
  3) paste the command you copied in 1) to open the template folder (provided by the extension above)
  4) right click the "Enemy-Template" folder and click "Reveal in File Explorer"
  5) copy the folder to the templates folder

Creating files from template:
  1) right click on the folder you want your new enemy folder to be nested in
  2) click "Create New Templated Folder"
  3) type in name of enemy (don't include the word "enemy", it gets appended) separated by dashes (all lower case), ex.:
    - ✔️ cool-guy
    - ✔️ bubble
    - ✔️ very-long-name
    - ❌ very LONG nAmE
    - ❌ Wrong-Name

Dependencies fixing notes:
  - to fix the dependency errors, import the MainScene and RangedEnemy/MeleeEnemy in the <name>-enemy.ts file
  - then import all the classes that are extended by the scripts further down the directory (avatar, body, movement, and machine)

2 ways to fix general dependency errors:
  A) press CTRL + Space with your caret at the end of a missing dependency to import it
  B) hover mouse over error, click "Quick Fix" and click "Import"

Avatar note:
  - it uses the ocean enemy's texture as default to have something to show visually