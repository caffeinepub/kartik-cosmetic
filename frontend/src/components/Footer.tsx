export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'kartik-cosmetic');

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-border">
              <img
                src="/assets/generated/kartik-cosmetic-logo.dim_256x256.png"
                alt="Kartik Cosmetic"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">Kartik Cosmetic</p>
              <p className="text-muted-foreground text-xs">Salon & Parlour Products</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              © {year} Kartik Cosmetic. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Premium beauty products for salons & parlours
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-xs">
              Built with{' '}
              <span className="text-primary">♥</span>
              {' '}using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
