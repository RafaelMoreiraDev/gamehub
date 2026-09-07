$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$gamesPath = Join-Path $projectRoot 'games'

Get-ChildItem -LiteralPath $gamesPath -Filter '*.html' | ForEach-Object {
    $file = $_
    $html = [IO.File]::ReadAllText($file.FullName)
    $titleMatch = [regex]::Match($html, '<title>(.*?)\s*-\s*GameHub</title>')
    if (-not $titleMatch.Success) { return }

    $gameName = $titleMatch.Groups[1].Value.Trim()
    $slug = $file.Name
    $url = "https://gamehubjogos.com.br/games/$slug"
    $descriptionMatch = [regex]::Match($html, '<meta name="description" content="([^"]+)">')
    $description = if ($descriptionMatch.Success) {
        $descriptionMatch.Groups[1].Value
    } else {
        "Jogue $gameName online grátis no navegador, sem download e sem cadastro. Supere seu recorde e desafie seus amigos no GameHub!"
    }

    $newTitle = "Jogar $gameName Online Grátis | GameHub"
    $html = $html.Replace($titleMatch.Value, "<title>$newTitle</title>")
    if (-not $descriptionMatch.Success) {
        $html = $html.Replace("<title>$newTitle</title>", "<title>$newTitle</title>`r`n    <meta name=`"description`" content=`"$description`">")
    }

    if ($html -notmatch 'rel="canonical"') {
        $social = @"
    <link rel="canonical" href="$url">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="GameHub">
    <meta property="og:title" content="$newTitle">
    <meta property="og:description" content="$description">
    <meta property="og:url" content="$url">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:image" content="https://gamehubjogos.com.br/img/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="$gameName no GameHub">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$newTitle">
    <meta name="twitter:description" content="$description">
    <meta name="twitter:image" content="https://gamehubjogos.com.br/img/og-image.png">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"VideoGame","name":"$gameName","url":"$url","description":"$description","gamePlatform":"Web browser","applicationCategory":"Game","operatingSystem":"Any","inLanguage":"pt-BR","image":"https://gamehubjogos.com.br/img/og-image.png","isAccessibleForFree":true}
    </script>
"@
        $descriptionTag = [regex]::Match($html, '<meta name="description" content="[^"]+">').Value
        $html = $html.Replace($descriptionTag, "$descriptionTag`r`n$social")
    }

    if ($html -notmatch 'js/game-share\.js') {
        $html = $html.Replace('</body>', '    <script src="../js/game-share.js?v=1"></script>' + "`r`n</body>")
    }

    [IO.File]::WriteAllText($file.FullName, $html, [Text.UTF8Encoding]::new($false))
}

Write-Host 'Game pages upgraded.'
