document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const uploadForm = document.getElementById('upload-form');
  const papersList = document.getElementById('papers-list');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const paper = document.getElementById('paper').files[0];
      const formData = new FormData();
      formData.append('title', title);
      formData.append('paper', paper);

      const response = await fetch('/api/examPapers/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      if (response.ok) {
        alert('Paper uploaded successfully');
      } else {
        alert('Failed to upload paper');
      }
    });
  }

  if (papersList) {
    (async () => {
      const response = await fetch('/api/examPapers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const papers = await response.json();
      
      papers.forEach(paper => {
        const paperElement = document.createElement('div');
        paperElement.textContent = paper.title;
        paperElement.addEventListener('click', async () => {
          const response = await fetch(`/api/examPapers/view/${paper._id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${paper.title}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });

        papersList.appendChild(paperElement);
      });
    })();
  }
});
