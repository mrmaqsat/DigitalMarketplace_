import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, TrendingUp, User } from 'lucide-react';

export default function TypographyTest() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Typography Test Page</h1>
          <p className="text-xl text-muted-foreground">Testing improved font weights and readability</p>
        </header>

        {/* Typography Scale Testing */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale with Enhanced Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold">Heading 1 (Bold 700)</h1>
                  <h2 className="text-3xl font-semibold">Heading 2 (Semibold 600)</h2>
                  <h3 className="text-2xl font-semibold">Heading 3 (Semibold 600)</h3>
                  <h4 className="text-xl font-semibold">Heading 4 (Semibold 600)</h4>
                  <h5 className="text-lg font-semibold">Heading 5 (Semibold 600)</h5>
                  <h6 className="text-base font-semibold">Heading 6 (Semibold 600)</h6>
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-medium">Large text (Medium 500)</p>
                  <p className="text-base font-medium">Regular text (Medium 500)</p>
                  <p className="text-sm font-medium">Small text (Medium 500)</p>
                  <p className="text-xs font-medium">Extra small text (Medium 500)</p>
                  <p className="text-sm text-muted-foreground">Muted text for comparison</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Component Testing */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UI Components with Enhanced Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Sample Product Card */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
                      alt="Sample Product"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        New
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Digital Art Collection
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      Amazing digital artwork with enhanced typography for better readability across all devices.
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">$29.99</span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-muted-foreground text-sm font-medium">4.8 (124)</span>
                      </div>
                    </div>
                    <Button className="w-full font-semibold">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Feature Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Enhanced Readability</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    All text now uses medium weight (500) for better visibility and readability across different browsers and devices.
                  </p>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Typography Stats</h3>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Font Weight</span>
                      <span className="text-sm font-semibold text-gray-900">500 (Medium)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Line Height</span>
                      <span className="text-sm font-semibold text-gray-900">1.6 (Loose)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Font Family</span>
                      <span className="text-sm font-semibold text-gray-900">Inter</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Button Testing */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Typography Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="font-semibold">
                  Primary Button (Semibold 600)
                </Button>
                <Button variant="outline" size="lg" className="font-medium">
                  Outline Button (Medium 500)
                </Button>
                <Button variant="secondary" size="lg" className="font-medium">
                  Secondary Button (Medium 500)
                </Button>
                <Button variant="ghost" size="lg" className="font-medium">
                  Ghost Button (Medium 500)
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Navigation Testing */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex space-x-8">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">Products</a>
                <a href="#" className="nav-link">Categories</a>
                <a href="#" className="nav-link">About</a>
                <a href="#" className="nav-link">Contact</a>
              </nav>
            </CardContent>
          </Card>
        </section>

        {/* Cross-Browser Testing Notice */}
        <section className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Cross-Browser Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-base font-medium">
                  This typography test page should be viewed in:
                </p>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Chrome (latest)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Firefox (latest)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Safari (latest)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Edge (latest)
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Test both desktop and mobile viewports to ensure consistent readability.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Mobile Typography Testing */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Typography Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="sm:hidden">
                  <p className="text-sm font-medium text-green-600 mb-2">✓ Mobile View Active</p>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Mobile Heading</h3>
                    <p className="text-sm font-medium">Mobile body text with enhanced readability</p>
                    <Button size="sm" className="font-medium">Mobile Button</Button>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-blue-600 mb-2">✓ Desktop View Active</p>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Desktop Heading</h3>
                    <p className="text-base font-medium">Desktop body text with enhanced readability</p>
                    <Button className="font-semibold">Desktop Button</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground font-medium">
            Typography test completed. All fonts should display with improved weight and readability.
          </p>
        </footer>
      </div>
    </div>
  );
}
