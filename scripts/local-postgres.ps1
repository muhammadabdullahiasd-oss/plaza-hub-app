param([ValidateSet('start', 'stop', 'status')][string] $Action = 'status')
$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$binary = Join-Path $project '.tools\postgresql-17.12\pgsql\bin\pg_ctl.exe'
$data = Join-Path $env:LOCALAPPDATA 'PlazaHub\PostgreSQL17-task005'
if (-not (Test-Path -LiteralPath $binary) -or -not (Test-Path -LiteralPath (Join-Path $data 'PG_VERSION'))) {
  throw 'The approved Task 005 local cluster is not installed. This command never installs or initializes one.'
}
if ((Get-Content -LiteralPath (Join-Path $data 'PG_VERSION') -Raw).Trim() -ne '17') { throw 'Unexpected cluster version.' }
if ($Action -eq 'status') { & $binary -D $data status; exit $LASTEXITCODE }
if ($Action -eq 'start') {
  $config = Get-Content -LiteralPath (Join-Path $data 'postgresql.conf') -Raw
  if ($config -notmatch "(?m)^listen_addresses = '127\.0\.0\.1'\r?$" -or $config -notmatch '(?m)^port = 55432\r?$') { throw 'Expected local listener configuration is missing.' }
  if (Get-NetTCPConnection -LocalPort 55432 -State Listen -ErrorAction SilentlyContinue) { throw 'Port 55432 is occupied. Inspect status; never stop an unrelated process.' }
}
$arguments = @('-D', ('"' + $data + '"'), '-w', '-t', '60')
if ($Action -eq 'start') { $arguments += @('-l', ('"' + (Join-Path $data 'server.log') + '"'), 'start') }
else { $arguments += @('-m', 'fast', 'stop') }
$process = Start-Process -FilePath $binary -ArgumentList $arguments -WindowStyle Hidden -PassThru -Wait -RedirectStandardOutput (Join-Path $data 'pgctl.stdout.log') -RedirectStandardError (Join-Path $data 'pgctl.stderr.log')
Get-Content -LiteralPath (Join-Path $data 'pgctl.stdout.log')
if ($process.ExitCode -ne 0) { Get-Content -LiteralPath (Join-Path $data 'pgctl.stderr.log'); throw "Cluster $Action failed." }
