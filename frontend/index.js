import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  feather.replace();

  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const postForm = document.getElementById('postForm');
  const blogForm = document.getElementById('blogForm');
  const postsSection = document.getElementById('posts');
  const loadingSpinner = document.getElementById('loadingSpinner');

  newPostBtn.addEventListener('click', () => {
    postForm.classList.toggle('hidden');
  });

  blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    showLoadingSpinner();

    try {
      await backend.addPost(title, body, author);
      blogForm.reset();
      quill.setContents([]);
      postForm.classList.add('hidden');
      await fetchAndDisplayPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      hideLoadingSpinner();
    }
  });

  async function fetchAndDisplayPosts() {
    showLoadingSpinner();

    try {
      const posts = await backend.getPosts();
      postsSection.innerHTML = '';

      posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p class="author">By ${post.author}</p>
          <div class="post-content">${post.body}</div>
          <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
        `;
        postsSection.appendChild(postElement);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      hideLoadingSpinner();
    }
  }

  function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
  }

  function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
  }

  await fetchAndDisplayPosts();
});
