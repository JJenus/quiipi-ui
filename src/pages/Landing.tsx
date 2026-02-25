import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, Users, Globe, Shield, Sparkles, Github, Twitter, Linkedin, Mail, Menu, X, Heart, Coffee, Award, BookOpen, Instagram, Youtube, PenTool, Code, Palette, Camera, Music } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash && target.href.includes(window.location.pathname)) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const stories = [
    {
      name: 'Jenus',
      role: 'Software Engineer',
      content: 'I was juggling spreadsheets, Google Docs, and sticky notes to track my clients. I built Quiipi because I knew there had to be a better way. Now it\'s the tool I wish I had 4 years ago.',
      avatar: 'Jj',
    },
    {
      name: 'Marcus',
      role: 'Early Beta User',
      content: 'I\'ve tried every client management tool out there. What makes Quiipi different is that it\'s built by someone who actually does this work. It just makes sense.',
      avatar: 'M',
    },
    {
      name: 'Elena',
      role: 'Design Agency Owner',
      content: 'The subscription tracking alone saved me from missing three domain renewals in my first month. That\'s when I knew this was built by people who understand real business problems.',
      avatar: 'E',
    },
  ];

  const principles = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: 'Built for the long haul',
      description: 'No venture capital, no exit strategy. Just a sustainable business focused on serving freelancers and small agencies.',
    },
    {
      icon: <Coffee className="h-6 w-6 text-primary" />,
      title: 'Made by makers',
      description: 'I\'m a developer who runs a business too. Every feature is something I actually needed and used myself first.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Privacy first',
      description: 'Your client data stays yours. No selling information, no complicated data sharing, just straightforward privacy.',
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Community driven',
      description: 'The roadmap comes from real conversations with people like you. Every feature request gets read and considered.',
    },
  ];

  const footerLinks = {
    product: [
      { name: 'Features', href: '#how-it-works' },
      { name: 'Story', href: '#story' },
      { name: 'Principles', href: '#principles' },
      { name: 'Changelog', href: '#' },
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
    social: [
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'GitHub', icon: Github, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
      { name: 'Instagram', icon: Instagram, href: '#' },
      { name: 'YouTube', icon: Youtube, href: '#' },
    ],
  };

  const professions = [
    { icon: <Code className="h-4 w-4" />, name: 'Developers' },
    { icon: <Palette className="h-4 w-4" />, name: 'Designers' },
    { icon: <PenTool className="h-4 w-4" />, name: 'Writers' },
    { icon: <Camera className="h-4 w-4" />, name: 'Photographers' },
    { icon: <Music className="h-4 w-4" />, name: 'Musicians' },
    { icon: <Award className="h-4 w-4" />, name: 'Consultants' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Quiipi</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">beta</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#story" className="text-sm font-medium hover:text-primary transition-colors">Story</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
              <a href="#principles" className="text-sm font-medium hover:text-primary transition-colors">Principles</a>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>Sign in</Button>
              <Button onClick={() => navigate('/register')}>Try it free</Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#story" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Story</a>
                <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>How it works</a>
                <a href="#principles" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Principles</a>
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => navigate('/login')}>Sign in</Button>
                  <Button onClick={() => navigate('/register')}>Try it free</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Personal and Direct */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>From one freelancer to another</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              A client management tool
              <span className="text-primary block mt-2">I built for myself</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              I got tired of chasing payments, missing renewal dates, and juggling spreadsheets. 
              So I built something better. Now I'm sharing it with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => navigate('/register')}>
                Try it for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#story">Read my story</a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card needed • Built by a solo developer • Your data stays yours
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent h-32 bottom-0 top-auto z-10"></div>
            <div className="bg-card rounded-xl shadow-2xl border overflow-hidden">
              <div className="h-10 bg-muted/50 border-b flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">Quiipi Dashboard</div>
              </div>
              
              {/* Dashboard Mockup */}
              <div className="p-6 bg-card">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-primary/5 rounded-lg border border-primary/10 p-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full mb-2"></div>
                      <div className="h-2 w-16 bg-primary/20 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="h-48 bg-primary/5 rounded-lg border border-primary/10 p-4">
                      <div className="h-4 w-32 bg-primary/20 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-primary/10 rounded"></div>
                        <div className="h-2 w-5/6 bg-primary/10 rounded"></div>
                        <div className="h-2 w-4/6 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="h-48 bg-primary/5 rounded-lg border border-primary/10 p-4">
                      <div className="h-4 w-24 bg-primary/20 rounded mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-8 bg-primary/10 rounded"></div>
                        <div className="h-8 bg-primary/10 rounded"></div>
                        <div className="h-8 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-center text-xs text-muted-foreground border-t bg-muted/30">
                A clean, intuitive dashboard that shows you what matters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section id="story" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">The story behind Quiipi</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <p>
                Hi, I'm Jenus. I've been a freelance software engineer for 4 years. 
                Over that time, I've tried every client management tool out there. 
                Some were too complicated. Some were too expensive. Most just didn't 
                solve the problems I actually had.
              </p>
              
              <p>
                Last year, I missed renewing a client's domain. It was a small mistake 
                that cost me a big client. That was the moment I decided to build 
                something for myself.
              </p>
              
              <p>
                I started with a simple spreadsheet, then a basic web app, and slowly 
                it grew into something that actually made my business run smoother. 
                I could track projects without stress, send invoices without dread, 
                and actually sleep better knowing I wouldn't miss another renewal.
              </p>
              
              <p>
                When I showed it to other freelancers, they asked if they could use it too. 
                So I cleaned it up, made it more general, and here we are. Quiipi is 
                the tool I wish existed years ago.
              </p>
              
              <div className="bg-card border rounded-lg p-6 mt-8">
                <p className="italic mb-4">
                  "I was skeptical at first, but after using it for a month, I realized this 
                  is exactly how client management should feel. Simple, intuitive, and actually helpful."
                </p>
                <p className="font-semibold">— Sarah, Early Beta User</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Features */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What it actually does</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Keep track of who you're working with</h3>
                  <p className="text-muted-foreground">All your clients in one place. Contact info, project history, billing details - everything you need.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Never miss a deadline again</h3>
                  <p className="text-muted-foreground">Project timelines, milestones, and reminders. You'll actually know what needs to happen next.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get paid without chasing</h3>
                  <p className="text-muted-foreground">Invoices that actually get paid. Track what's owed, send reminders automatically, and see your cash flow.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track subscriptions without spreadsheets</h3>
                  <p className="text-muted-foreground">Domains, hosting, tools - know what's renewing when. No more surprise charges or expired certificates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who it's for */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Used by freelancers and small teams in</p>
            <div className="flex flex-wrap justify-center gap-6">
              {professions.map((prof, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  {prof.icon}
                  <span>{prof.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section id="principles" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold mb-4 text-center">How I build this</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            These are the principles that guide every decision. No corporate jargon, just honest values.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-card border rounded-xl p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                <p className="text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Real People */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-3xl font-bold mb-4 text-center">People I've helped</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Real stories from people who actually use this thing.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <div key={index} className="bg-card border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold">
                    {story.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">"{story.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Want to give it a shot?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            No pressure. No sales calls. Just a 14-day trial to see if it works for you.
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/register')}>
            Start your free trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Already using it? <button onClick={() => navigate('/login')} className="text-primary hover:underline">Sign in here</button>
          </p>
        </div>
      </section>

      {/* Improved Footer */}
      <footer className="bg-card border-t pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">Quiipi</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">beta</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                A client management tool built by a freelancer, for freelancers. 
                No corporate nonsense, just honest software that helps you run your business.
              </p>
              <div className="flex space-x-4">
                {footerLinks.social.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup (Optional) */}
          <div className="border-t border-border pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-sm font-semibold mb-2">Stay in the loop</h4>
              <p className="text-xs text-muted-foreground mb-4">
                No spam, just occasional updates about new features and improvements.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Quiipi. All rights reserved.
                </span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  Made with <Heart className="h-3 w-3 inline text-red-500" /> in the Portharcourt
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};