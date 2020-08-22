# mitchelljones.com
[mitchelljones.com](https://www.mitchelljones.com) is my personal/portfolio website with a collection of my favorite projects.

To maximize performance, the final site build is a simple static directory hosted on an Amazon AWS EC2 instance with CloudFlare handling DNS and caching. [Gulp](https://github.com/gulpjs/gulp) compiles, bundles, minifies, and purges Pug, Sass, and ES6 JS assets from the `src` directory into HTML, CSS, and plain JavaScript in `public`.


## Technologies Used

- [Gulp](https://github.com/gulpjs/gulp) - Toolkit to automate compiling, bundling, and minifying.
- [Pug](https://github.com/pugjs/pug) - Templating engine that compiles to HTML
- [Sass](https://github.com/sass/sass) - Syntactically Awesome Stylesheets; a powerful styling language that compiles to CSS.
- [PurgeCSS](https://github.com/FullHuman/purgecss) - CSS purger (...duh); removes unused CSS from large libraries like [Bootstrap](https://github.com/twbs/bootstrap).
- [clean-css](https://github.com/jakubpawlowicz/clean-css) - CSS minifier.
- [JSHint](https://github.com/jshint/jshint) - JavaScript linter (error-checker).
- [Babel](https://github.com/babel/babel) - Transpiler that turns modern (ES6) JavaScript into more primitive 'plain' JavaScript for compatibility.
- [Terser](https://github.com/terser/terser) - JavaScript minifier.
- [Showdown](https://github.com/showdownjs/showdown) - [Markdown](https://en.wikipedia.org/wiki/Markdown) to HTML converter.