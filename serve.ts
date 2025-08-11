import Router from "https://deno.land/x/galo@v0.3.2/mod.ts";
import { escape } from "jsr:@std/html@1.0.4/entities";

const router = new Router();

router.get("/edit", () => {
  return new Response(editContent(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

router.post("/edit", async ({ request }) => {
  const data = await request.formData();
  const content = data.get("content");

  if (typeof content === "string") {
    Deno.writeTextFileSync("./files/index.html", content);
  }

  return Response.redirect(new URL("/", request.url));
});

router.get("/push", () => {
  return new Response(pushChanges(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

router.post("/push", async () => {
  const messages: string[] = [];

  try {
    messages.push(await runCommand("deno", ["fmt"]));
    messages.push(await runCommand("git", ["add", "."]));
    messages.push(
      await runCommand("git", ["commit", "-m", "Update index.html"]),
    );
    messages.push(await runCommand("git", ["push"]));
    messages.push("Changes pushed successfully!");
  } catch (error) {
    messages.push(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return new Response(messages.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
});

router.staticFiles("/", "./files");

Deno.serve(router.fetch);

function editContent() {
  const content = Deno.readTextFileSync("./files/index.html");

  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit document</title>
</head>
<body>
  <form action="/edit" method="post">
    <label for="content">Content of the document</label>
    <textarea name="content" id="content">${escape(content)}</textarea>
    <button>Send changes</button>
  </form>
</body>
</html>`;
}

function pushChanges() {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Push changes</title>
</head>
<body>
  <form action="/push" method="post">
    <button>Push changes</button>
  </form>
</body>
</html>
  `;
}

async function runCommand(cmd: string, args: string[] = []) {
  const command = new Deno.Command(cmd, {
    args,
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr } = await command.output();

  if (stderr) {
    console.error(new TextDecoder().decode(stderr));
  }

  return new TextDecoder().decode(stdout);
}
