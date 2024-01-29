const apiBase =
  "https://public-api.wordpress.com/wp/v2/sites/semester69.wordpress.com/posts?_embed";
let currentPage = 1;
const postsPerPage = 10;
const container = document.querySelector(".blog-page-container");
const loadMoreButton = document.getElementById("load-more");

// Fetching REST API
async function getProducts() {
  const response = await fetch(apiBase);
  const products = await response.json();
  return products;
}

function createProductHTML(product) {
  const productContainer = document.createElement("div");
  productContainer.classList.add("product");
  productContainer.id = product.id;

  const title = document.createElement("h2");
  title.innerText = product.title.rendered;
  productContainer.appendChild(title);

  const productImage = product._embedded["wp:featuredmedia"][0];
  const img = document.createElement("img");
  img.src = productImage.source_url;
  img.alt = productImage.alt_text;
  img.style.minWidth = " 200px";
  img.style.height = "248px";
  img.style.objectFit = "cover";
  img.style.display = "flex";
  img.style.paddingBottom = "1rem";
  productContainer.appendChild(img);

  const content = document.createElement("div");
  const contentText = product.content.rendered;
  const words = contentText.split(" ");
  const truncatedContent = words.slice(0, 50).join(" ");
  content.innerHTML = truncatedContent;
  productContainer.appendChild(content);

  const readMoreLink = document.createElement("a");
  readMoreLink.href = `blog-specific-page.html?id=${product.id}`;
  readMoreLink.innerText = "Read More";
  readMoreLink.style.textDecoration = "underline";
  readMoreLink.style.fontWeight = "bold";
  readMoreLink.style.paddingBottom = "2rem";
  productContainer.appendChild(readMoreLink);

  if (product.images && Array.isArray(product.images)) {
    for (let i = 0; i < product.images.length; i++) {
      const imgData = product.images[i];
      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = imgData.alt;
      productContainer.appendChild(img);
    }
  }

  container.appendChild(productContainer);

  return productContainer;
}

function redirectToProductDetailPage(productId) {
  window.location.href = `blog-specific-page.html?id=${productId}`;
}

async function createProductsHTML() {
  const products = await getProducts();

  for (const product of products) {
    const productContainer = createProductHTML(product);
    container.appendChild(productContainer);

    productContainer.addEventListener("click", () => {
      redirectToProductDetailPage(product.id);
    });
  }
}

// Get more posts button

async function getMorePosts(page) {
  const response = await fetch(`${apiBase}&page=${page}`);
  const products = await response.json();
  return products;
}

function createPostsHTML(products) {
  for (const product of products) {
    const productContainer = createProductHTML(product);
    container.appendChild(productContainer);
  }
}

async function loadMorePosts() {
  currentPage++;
  const morePosts = await getMorePosts(currentPage);

  if (Array.isArray(morePosts) && morePosts.length > 0) {
    createPostsHTML(morePosts);
  } else {
    loadMoreButton.style.display = "none";
    loadMoreButton.removeEventListener("click", loadMorePosts);
  }
}

loadMoreButton.addEventListener("click", loadMorePosts);

async function main() {
  await createProductsHTML();
}

main();
