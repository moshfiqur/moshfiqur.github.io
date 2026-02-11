# Personal Portfolio Website

This is a personal portfolio website built with Jekyll, showcasing professional experience and projects.

## Features

- **Jekyll-powered**: Static site generation for fast, secure, and maintainable website
- **Data-driven**: Content managed through YAML data files for easy updates
- **Modular design**: Reusable components via includes and layouts
- **Responsive layout**: Mobile-friendly design with Bootstrap
- **Portfolio showcase**: Interactive carousels for mobile apps, web apps, and productivity tools
- **Dynamic sections**: Tech stacks and work experience

## Project Structure

```
├── _config.yml           # Jekyll configuration
├── _data/                # YAML data files for content
│   ├── experience.yml
│   ├── github_repos.yml
│   ├── portfolio.yml
│   ├── site.yml
│   ├── social.yml
│   └── tech_stacks.yml
├── _includes/            # Reusable HTML components
│   ├── about.html
│   ├── contact.html
│   ├── footer.html
│   ├── github-repos.html
│   ├── head.html
│   ├── header.html
│   ├── nav.html
│   ├── portfolio.html
│   ├── portfolio-modal.html
│   ├── resume.html
│   ├── scripts.html
│   └── tech-stacks.html
├── _layouts/             # Page templates
│   └── default.html
├── _sass/                # SCSS stylesheets
│   └── custom.scss
├── css/                  # Stylesheets
├── js/                   # JavaScript files
├── img/                  # Images
├── portfolio/            # Portfolio project images
└── resume/               # Resume PDF

```

## Prerequisites

- Ruby (version 3.0 or higher)
- Bundler gem

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moshfiqur/moshfiqur.github.io.git
   cd moshfiqur.github.io
   ```

2. **Install dependencies**:
   ```bash
   bundle config set --local path 'vendor/bundle'
   bundle install
   ```

## Development

1. **Build the site**:
   ```bash
   bundle exec jekyll build
   ```

2. **Serve the site locally**:
   ```bash
   bundle exec jekyll serve
   ```

3. **Access the site**: Open http://localhost:4000 in your browser

4. **Watch for changes** (automatic rebuild on file changes):
   ```bash
   bundle exec jekyll serve --watch
   ```

## Deployment

This site is designed to be deployed on GitHub Pages:

1. Push changes to the main branch
2. GitHub Pages will automatically build and deploy the site
3. The site will be available at https://moshfiqur.github.io

## Updating Content

All content is managed through YAML files in the `_data/` directory:

- **Portfolio projects**: Edit `_data/portfolio.yml`
- **Technology stacks**: Edit `_data/tech_stacks.yml`
- **Work experience**: Edit `_data/experience.yml`
- **GitHub repositories**: Edit `_data/github_repos.yml`
- **Social links**: Edit `_data/social.yml`
- **Site metadata**: Edit `_data/site.yml`

## Customization

### Styling
- Main custom styles: `_sass/custom.scss`
- Existing CSS files: `css/` directory

### JavaScript
- Portfolio functionality: `js/portfolio.js`
- Other scripts: `js/` directory

### Sections
To add or modify sections, edit the corresponding include files in `_includes/` and update `index.html` to include them.

## Technologies Used

- **Jekyll 4.4.1**: Static site generator
- **Bootstrap**: Responsive CSS framework
- **Font Awesome**: Icon library
- **jQuery**: JavaScript library
- **SASS**: CSS preprocessor

## License

© Moshfiqur Rahman. All rights reserved.

## Credits

- Design template by [TemplateWire](http://www.templatewire.com)
- Background photo by [NASA](https://unsplash.com/@nasa) on Unsplash
