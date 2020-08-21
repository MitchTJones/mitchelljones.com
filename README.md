# mitchelljones.com
[mitchelljones.com](https://www.mitchelljones.com) is my personal/portfolio website with a collection of my favorite projects.

The site itself is a simple static directory hosted on an Amazon AWS EC2 instance. [gulp](https://github.com/gulpjs/gulp) is used to compile, bundle, minify, and purge assets from the `src` directory into html, css, and js in `public`.

## Technologies Used

- [Gulp](https://github.com/gulpjs/gulp) - Toolkit to automate compiling, bundling, and minifying.
- [Pug](https://github.com/pugjs/pug) - Templating engine that compiles to HTML
- [Sass](https://github.com/sass/sass) - Syntactically Awesome Stylesheets; a powerful styling language that compiles to CSS.
- [JSHint](https://github.com/jshint/jshint) - JavaScript linter (error-checker).
- [PurgeCSS](https://github.com/FullHuman/purgecss) - CSS purger (...duh); removes unused CSS from large libraries like [Bootstrap](https://github.com/twbs/bootstrap).
- [Babel](https://github.com/babel/babel) - Transpiler that turns modern (ES6) JavaScript into more primitive JavaScript for compatibility.
- [Terser](https://github.com/terser/terser) - JavaScript minifier.
- [clean-css](https://github.com/jakubpawlowicz/clean-css) - CSS minifier.
- [Showdown](https://github.com/showdownjs/showdown) - [Markdown](https://en.wikipedia.org/wiki/Markdown) to HTML converter.