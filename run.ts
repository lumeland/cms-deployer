const gitUrl = Deno.env.get("GIT_URL");
const gitUsername = Deno.env.get("GIT_USERNAME");
const gitPassword = Deno.env.get("GIT_PASSWORD");
const gitEmail = Deno.env.get("GIT_EMAIL");

if (!gitUrl || !gitUsername || !gitPassword || !gitEmail) {
  console.error(
    "GIT_URL, GIT_USERNAME, GIT_PASSWORD, and GIT_EMAIL must be set.",
  );
  Deno.exit(1);
}

const gitRepo = new URL(gitUrl);
gitRepo.username = gitUsername;
gitRepo.password = gitPassword;

console.log(`Cloning repository from ${gitRepo.toString()}...`);

// Ensure the current directory is empty
const entries = Deno.readDirSync(".");
for (const entry of entries) {
  Deno.removeSync(entry.name, { recursive: true });
}

// Clone the repository
await run("git", "clone", "--depth=1", gitRepo.toString(), ".");

// Configure Git user
await run("git", "config", "user.name", gitUsername);
await run("git", "config", "user.email", gitEmail);
await run("git", "config", "pull.rebase", "false");

async function run(cmd: string, ...args: string[]) {
  const command = new Deno.Command(cmd, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  });

  await command.output();
}
