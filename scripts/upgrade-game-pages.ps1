$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$gamesPath = Join-Path $projectRoot 'games'
$gratis = 'gr' + [char]0x00E1 + 'tis'

Get-ChildItem -LiteralPath $gamesPath -Filter '*.html' | ForEach-Object {
    $file = $_
    $html = [IO.File]::ReadAllText($file.FullName)
    $titleMatch = [regex]::Match($html, '<title>.*?</title>')
    $headingMatch = [regex]::Match($html, '<h1[^>]*>(.*?)</h1>', 'Singleline')
    if (-not $titleMatch.Success -or -not $headingMatch.Success) { return }

    $gameName = ([regex]::Replace($headingMatch.Groups[1].Value, '<[^>]+>', '')).Trim()
    $slug = $file.Name
    $url = "https://gamehubjogos.com.br/games/$slug"
    $descriptionMatch = [regex]::Match($html, '<meta name="description" content="([^"]+)">')
    $description = if ($descriptionMatch.Success) {
        $descriptionMatch.Groups[1].Value
    } else {
        "Jogue $gameName online $gratis no navegador, sem download e sem cadastro. Supere seu recorde e desafie seus amigos no GameHub!"
    }

    $newTitle = "Jogar $gameName Online $gratis | GameHub"
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
    <meta property="og:image" content="https://gamehubjogos.com.br/img/games/$($file.BaseName).jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="$gameName no GameHub">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$newTitle">
    <meta name="twitter:description" content="$description">
    <meta name="twitter:image" content="https://gamehubjogos.com.br/img/games/$($file.BaseName).jpg">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"VideoGame","name":"$gameName","url":"$url","description":"$description","gamePlatform":"Web browser","applicationCategory":"Game","operatingSystem":"Any","inLanguage":"pt-BR","image":"https://gamehubjogos.com.br/img/games/$($file.BaseName).jpg","isAccessibleForFree":true}
    </script>
"@
        $descriptionTag = [regex]::Match($html, '<meta name="description" content="[^"]+">').Value
        $html = $html.Replace($descriptionTag, "$descriptionTag`r`n$social")
    }

    if ($html -notmatch 'js/game-share\.js') {
        $html = $html.Replace('</body>', '    <script src="../js/analytics.js?v=1"></script>' + "`r`n    " + '<script src="../js/game-share.js?v=4"></script>' + "`r`n    " + '<script src="../js/mobile-controls.js?v=2"></script>' + "`r`n</body>")
    }

    if ($html -notmatch 'game-page\.css') {
        $html = $html.Replace('</head>', '    <link rel="stylesheet" href="../css/game-page.css?v=1">' + "`r`n</head>")
    }

    if ($html -notmatch 'gamehub-game-content') {
        $content = @"
    <section class="gamehub-game-content" aria-labelledby="about-game">
        <h2 id="about-game">Como jogar $gameName</h2>
        <p>$description</p>
        <h3>Controles e dicas</h3>
        <p>Use os controles exibidos no jogo, escolha a dificuldade ideal e tente superar seu recorde. No celular, use os controles de toque quando dispon&iacute;veis.</p>
        <h3>Mais jogos gr&aacute;tis</h3>
        <nav class="gamehub-related" aria-label="Jogos relacionados"><a href="snake.html">Cobrinha</a><a href="quiz.html">Quiz</a><a href="space-invaders.html">Invasores Espaciais</a><a href="../index.html#games">Ver todos</a></nav>
    </section>
"@
        $html = $html.Replace('    <script src="../js/analytics.js?v=1"></script>', "$content`r`n    <script src=`"../js/analytics.js?v=1`"></script>")
    }

    [IO.File]::WriteAllText($file.FullName, $html, [Text.UTF8Encoding]::new($false))
}

Write-Host 'Game pages upgraded.'
