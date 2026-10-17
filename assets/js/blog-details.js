// Evergreen Events - Dynamic Blog Details Controller
document.addEventListener('DOMContentLoaded', function() {
  if (!window.BLOG_POSTS || !window.BLOG_POSTS.length) return;

  var params = new URLSearchParams(window.location.search);
  var postId = parseInt(params.get('id'), 10);
  var post = window.BLOG_POSTS.find(function(p) { return p.id === postId; });
  if (!post) {
    post = window.BLOG_POSTS[0];
  }

  // Document Title
  document.title = post.title + ' - Evergreen Events';

  // Breadcrumb
  var bcEl = document.getElementById('articleBreadcrumb');
  if (bcEl) bcEl.textContent = post.breadcrumb || post.title;

  // Category & Read Time Badge
  var badgeEl = document.getElementById('articleBadge');
  if (badgeEl) badgeEl.innerHTML = '<span>✨</span> Category: ' + post.cat + ' · ' + post.readTime;

  // Title
  var titleEl = document.getElementById('articleTitle');
  if (titleEl) titleEl.textContent = post.title;

  // Author & Date
  var authorEl = document.getElementById('articleAuthor');
  if (authorEl) authorEl.innerHTML = 'By <strong>' + post.author + '</strong>, ' + post.authorRole;
  var dateEl = document.getElementById('articleDate');
  if (dateEl) dateEl.textContent = 'Published ' + post.date;

  // Featured Main Image
  var imgEl = document.getElementById('articleImage');
  if (imgEl) {
    imgEl.src = post.img;
    imgEl.alt = post.title;
  }

  // Intro Lead
  var leadEl = document.getElementById('articleLead');
  if (leadEl && post.lead) leadEl.textContent = post.lead;

  // Pro Tip
  var proTipEl = document.getElementById('articleProTip');
  if (proTipEl) {
    if (post.proTip) {
      proTipEl.style.display = 'block';
      proTipEl.innerHTML = '<p class="fst-italic mb-0">“' + post.proTip + '”</p>';
    } else {
      proTipEl.style.display = 'none';
    }
  }

  // Sections & Table of Contents
  var sectionsEl = document.getElementById('articleSections');
  var tocEl = document.getElementById('articleToc');
  if (sectionsEl && post.sections && post.sections.length) {
    sectionsEl.innerHTML = post.sections.map(function(sec) {
      return '<h3 class="font-serif mt-5 mb-3" id="' + sec.id + '">' + sec.title + '</h3>' + sec.content;
    }).join('');

    if (tocEl) {
      tocEl.innerHTML = post.sections.map(function(sec) {
        return '<li class="py-1"><a href="#' + sec.id + '" class="text-decoration-none">' + sec.title + '</a></li>';
      }).join('');
    }
  }

  // Author Bio Widget
  var authorBioName = document.getElementById('authorBioName');
  if (authorBioName) authorBioName.textContent = 'About the Author: ' + post.author;

  // Related Articles
  var relEl = document.getElementById('relatedArticles');
  if (relEl) {
    var otherPosts = window.BLOG_POSTS.filter(function(p) { return p.id !== post.id; }).slice(0, 3);
    relEl.innerHTML = otherPosts.map(function(p) {
      return '<div class="col-md-4">' +
        '<div class="card h-100 hov">' +
        '<a href="blog-details.html?id=' + p.id + '">' +
        '<img src="' + p.img + '" class="card-img-top" alt="' + p.title + '" style="height: 180px; object-fit: cover;">' +
        '</a>' +
        '<div class="card-body p-3">' +
        '<span class="badge badge-gold mb-1">' + p.cat + '</span>' +
        '<h6 class="mt-1"><a href="blog-details.html?id=' + p.id + '" class="text-reset text-decoration-none">' + p.title + '</a></h6>' +
        '<small class="text-muted">' + p.date + ' · ' + p.readTime + '</small>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  }
});
