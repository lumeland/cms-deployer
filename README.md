# Testing Deno Deploy EA with LumeCMS

The aim of this repository is to test the new Deno Deploy EA so it can finally
be used to run LumeCMS.

- The project in Deno Deploy doesn't have a `.git` folder, so it's not possible
  to push changes. As a workaround, I can clone it during the build process.
- Deno Deploy allows writing to disk, but there's no persistence. When the
  current isolate goes away, all changes are lost.
  - It was suggested to push changes to a temp branch after every edit. This
    would require changing the existing Git implementation and would complicate
    branch management for users.
- Deno Deploy can open and close an arbitrary number of isolates. This means you
  can make changes in one isolate while another user makes changes in another
  isolate, and both sets of changes are independent.
  - The suggested workaround is to run `git pull` periodically to keep all
    isolates in sync.

What features in Deno Deploy EA would make easier to deploy LumeCMS?

- Only one isolate
- An option to keep the .git folder after the build
- If the isolate is closed, persist the disk changes so it can be resumed later
  without losing anything.
