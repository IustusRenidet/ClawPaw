$ErrorActionPreference = "Stop"

$projectRoot = "c:\Users\Frida Sophia\Desktop\DESARROLLOS\ClawPaw"
$client = "C:\Users\Frida Sophia\.codex\skills\develop-web-game\scripts\web_game_playwright_client.js"

$server = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WorkingDirectory $projectRoot

try {
  Start-Sleep -Seconds 2
  New-Item -ItemType Directory -Force "$projectRoot\output\web-game\platformer" | Out-Null
  New-Item -ItemType Directory -Force "$projectRoot\output\web-game\symbols" | Out-Null
  New-Item -ItemType Directory -Force "$projectRoot\output\web-game\full" | Out-Null

  node $client `
    --url "http://localhost:3000" `
    --click-selector "#start-adventure" `
    --actions-file "$projectRoot\output-actions-platformer.json" `
    --iterations 1 `
    --pause-ms 250 `
    --screenshot-dir "$projectRoot\output\web-game\platformer"

  node $client `
    --url "http://localhost:3000" `
    --click-selector "#start-adventure" `
    --actions-file "$projectRoot\output-actions-symbols.json" `
    --iterations 1 `
    --pause-ms 250 `
    --screenshot-dir "$projectRoot\output\web-game\symbols"

  node $client `
    --url "http://localhost:3000" `
    --click-selector "#start-adventure" `
    --actions-file "$projectRoot\output-actions-full.json" `
    --iterations 1 `
    --pause-ms 250 `
    --screenshot-dir "$projectRoot\output\web-game\full"
}
finally {
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  }
}
