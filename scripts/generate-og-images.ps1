$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$basePath = Join-Path $root 'img\og-arcade-base.png'
$outputDir = Join-Path $root 'img\games'
$gratis = 'gr' + [char]0x00E1 + 'tis'
[IO.Directory]::CreateDirectory($outputDir) | Out-Null

$base = [Drawing.Image]::FromFile($basePath)
try {
    Get-ChildItem (Join-Path $root 'games') -Filter '*.html' | ForEach-Object {
        $html = [IO.File]::ReadAllText($_.FullName)
        $match = [regex]::Match($html, '<h1[^>]*>(.*?)</h1>', 'Singleline')
        if (-not $match.Success) { return }
        $title = ([regex]::Replace($match.Groups[1].Value, '<[^>]+>', '')).Trim()
        $slug = $_.BaseName

        $bitmap = [Drawing.Bitmap]::new(1200, 630)
        $graphics = [Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.SmoothingMode = 'HighQuality'
            $graphics.InterpolationMode = 'HighQualityBicubic'
            $graphics.DrawImage($base, 0, 0, 1200, 630)
            $graphics.FillRectangle([Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(125, 2, 5, 28)), 0, 0, 760, 630)

            $brandFont = [Drawing.Font]::new('Arial', 24, [Drawing.FontStyle]::Bold)
            $titleSize = if ($title.Length -gt 22) { 48 } else { 58 }
            $titleFont = [Drawing.Font]::new('Arial', $titleSize, [Drawing.FontStyle]::Bold)
            $subtitleFont = [Drawing.Font]::new('Arial', 25, [Drawing.FontStyle]::Regular)
            $ctaFont = [Drawing.Font]::new('Arial', 22, [Drawing.FontStyle]::Bold)
            $white = [Drawing.Brushes]::White
            $muted = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(225, 210, 225, 255))
            $accent = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(255, 78, 205, 196))

            $graphics.DrawString('GAMEHUB', $brandFont, $accent, 64, 54)
            $titleRect = [Drawing.RectangleF]::new(60, 150, 650, 180)
            $graphics.DrawString($title, $titleFont, $white, $titleRect)
            $graphics.DrawString("Jogue $gratis no navegador", $subtitleFont, $muted, 65, 375)
            $graphics.FillRectangle($accent, 64, 466, 290, 62)
            $graphics.DrawString('JOGAR AGORA', $ctaFont, [Drawing.Brushes]::White, 91, 482)

            $target = Join-Path $outputDir "$slug.jpg"
            $encoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
            $parameters = [Drawing.Imaging.EncoderParameters]::new(1)
            $parameters.Param[0] = [Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality, 86L)
            $bitmap.Save($target, $encoder, $parameters)
            $parameters.Dispose()
        } finally {
            $graphics.Dispose()
            $bitmap.Dispose()
        }
    }
} finally {
    $base.Dispose()
}

Write-Host 'Open Graph images generated.'
