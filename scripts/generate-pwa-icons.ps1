$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$source = [Drawing.Image]::FromFile((Join-Path $root 'img\og-arcade-base.png'))
try {
    foreach ($size in 192, 512) {
        $bitmap = [Drawing.Bitmap]::new($size, $size)
        $graphics = [Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.SmoothingMode = 'HighQuality'
            $graphics.DrawImage($source, [Drawing.Rectangle]::new(0, 0, $size, $size), [Drawing.Rectangle]::new(0, 0, $source.Height, $source.Height), [Drawing.GraphicsUnit]::Pixel)
            $graphics.FillEllipse([Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(220, 255, 107, 107)), $size * .16, $size * .16, $size * .68, $size * .68)
            $font = [Drawing.Font]::new('Arial', $size * .25, [Drawing.FontStyle]::Bold)
            $format = [Drawing.StringFormat]::new()
            $format.Alignment = 'Center'; $format.LineAlignment = 'Center'
            $graphics.DrawString('GH', $font, [Drawing.Brushes]::White, [Drawing.RectangleF]::new(0, 0, $size, $size), $format)
            $bitmap.Save((Join-Path $root "img\icon-$size.png"), [Drawing.Imaging.ImageFormat]::Png)
        } finally { $graphics.Dispose(); $bitmap.Dispose() }
    }
} finally { $source.Dispose() }
Write-Host 'PWA icons generated.'
