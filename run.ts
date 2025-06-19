const decoder = new TextDecoder();
const gitUrl = Deno.env.get("GIT_URL");
const gitUsername = Deno.env.get("GIT_USERNAME");
const gitPassword = Deno.env.get("GIT_PASSWORD");

if (!gitUrl || !gitUsername || !gitPassword) {
  console.error("GIT_URL, GIT_USERNAME, and GIT_PASSWORD must be set.");
  Deno.exit(1);
}

const gitRepo = new URL(gitUrl);
gitRepo.username = gitUsername;
gitRepo.password = gitPassword;

console.log(`Cloning repository from ${gitRepo.toString()}...`);

const result = await runCommand("git", ["clone", "--depth=1", gitRepo.toString(), "."]);
console.log(result);

async function runCommand(cmd: string, args: string[] = []) {
  const command = new Deno.Command(cmd, {
    args,
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr } = await command.output();

  if (stderr) {
    console.error(decoder.decode(stderr));
  }

  return decoder.decode(stdout);
}
