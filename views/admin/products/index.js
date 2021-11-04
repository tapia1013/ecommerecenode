const layout = require('../layout');

module.exports = ({ products }) => {
  const renderedProducts = products.map((product) => {
    return `
      <div>
        ${product.title}
      </div>
    `;
  }).join(''); // join takes all mapped html and joins them into 1

  return layout({
    content: `
      <h1 class="title">Products</h1>
      ${renderedProducts}
    `
  });
};