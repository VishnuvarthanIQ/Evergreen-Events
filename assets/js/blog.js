// Evergreen Events - Blog Filtering & Search Engine
(function() {
  var POSTS = window.BLOG_POSTS || [
    {
      id: 1,
      title: 'Corporate Holiday Party Ideas That Employees Actually Love',
      cat: 'Holiday Parties',
      img: 'assets/img/blog-1.jpg',
      date: 'Oct 12, 2026',
      readTime: '5 min read',
      excerpt: 'Discover creative themes, interactive food stations, and modern entertainment formats that make your year-end party unforgettable.'
    },
    {
      id: 2,
      title: 'Office Christmas Party Themes for 2026',
      cat: 'Themes',
      img: 'assets/img/Office Christmas Party Themes for 2026.jpg',
      date: 'Oct 05, 2026',
      readTime: '6 min read',
      excerpt: 'From Winter Wonderland and Great Gatsby Glam to Sustainable Chic—find the trendiest holiday decor aesthetics.'
    },
    {
      id: 3,
      title: 'Employee Engagement Activities That Actually Work',
      cat: 'Engagement',
      img: 'assets/img/blog-3.jpg',
      date: 'Sep 28, 2026',
      readTime: '4 min read',
      excerpt: 'Ditch forced icebreakers for high-energy trivia, casino tables, VR lounges, and bespoke culinary masterclasses.'
    },
    {
      id: 4,
      title: 'Strategic Corporate Event Budgeting: High Impact, Zero Waste',
      cat: 'Budgeting',
      img: 'assets/img/blog-4.jpg',
      date: 'Sep 19, 2026',
      readTime: '7 min read',
      excerpt: 'How to allocate funds across venue, AV, gourmet catering, and gifts without unnecessary overheads.'
    },
    {
      id: 5,
      title: '7 Crucial Questions Before Signing a Luxury Venue Contract',
      cat: 'Venues',
      img: 'assets/img/blog-5.jpg',
      date: 'Sep 10, 2026',
      readTime: '5 min read',
      excerpt: 'Avoid hidden corkage fees, power surcharge traps, curfew restrictions, and load-in penalties.'
    },
    {
      id: 6,
      title: 'Live Band vs. Keynote DJ: Choosing the Right Entertainment',
      cat: 'Entertainment',
      img: 'assets/img/blog-6.jpg',
      date: 'Aug 29, 2026',
      readTime: '4 min read',
      excerpt: 'Analyzing acoustics, pacing, crowd energy, and seamless transitions for a sophisticated gala evening.'
    },
    {
      id: 7,
      title: 'Inclusive Banqueting: Managing 10+ Dietary Profiles in Corporate Menus',
      cat: 'Catering',
      img: 'assets/img/service-9.jpg',
      date: 'Aug 18, 2026',
      readTime: '6 min read',
      excerpt: 'How leading corporate planners handle pure vegetarian, Jain, halal, vegan, and celiac dietary protocols with zero kitchen cross-contamination.'
    },
    {
      id: 8,
      title: 'Hybrid Holiday Galas: Uniting Remote and In-Person Workforces',
      cat: 'Production',
      img: 'assets/img/Hybrid Holiday Galas.jpg',
      date: 'Aug 04, 2026',
      readTime: '5 min read',
      excerpt: 'Leverage multi-cam live broadcasting, interactive digital voting lounges, and synchronized home feast hampers for distributed teams.'
    },
    {
      id: 9,
      title: 'Designing High-Prestige Annual Corporate Awards That Boost Retention',
      cat: 'Engagement',
      img: 'assets/img/about-story.jpg',
      date: 'Jul 22, 2026',
      readTime: '7 min read',
      excerpt: 'Transform routine award ceremonies into unforgettable emotional milestones with bespoke crystal trophies, custom entrance fanfares, and peer recognition.'
    }
  ];

  var currentCategory = 'All';
  var searchQuery = '';
  var displayedCount = 6;

  var gridEl = document.getElementById('grid');
  var catBtnsContainer = document.getElementById('cats');
  var searchInput = document.getElementById('q');
  var moreBtn = document.getElementById('more');
  var emptyMsg = document.getElementById('empty');

  if (!gridEl) return;

  // Render Category Filter Buttons
  var categories = ['All', 'Holiday Parties', 'Themes', 'Engagement', 'Budgeting', 'Venues', 'Entertainment'];
  if (catBtnsContainer) {
    catBtnsContainer.innerHTML = categories.map(function(cat) {
      return '<button type="button" class="btn btn-sm ' + (cat === currentCategory ? 'btn-gold' : 'btn-ghost') + '" data-c="' + cat + '">' + cat + '</button>';
    }).join(' ');

    catBtnsContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-c]');
      if (btn) {
        currentCategory = btn.dataset.c;
        displayedCount = 6;
        catBtnsContainer.querySelectorAll('button').forEach(function(b) {
          b.className = 'btn btn-sm ' + (b.dataset.c === currentCategory ? 'btn-gold' : 'btn-ghost');
        });
        renderArticles();
      }
    });
  }

  // Realtime search
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value.toLowerCase().trim();
      displayedCount = 6;
      renderArticles();
    });
  }

  // Load More Button
  if (moreBtn) {
    moreBtn.addEventListener('click', function() {
      displayedCount += 3;
      renderArticles();
    });
  }

  function renderArticles() {
    var filtered = POSTS.filter(function(post) {
      var matchCat = currentCategory === 'All' || post.cat === currentCategory;
      var matchQuery = !searchQuery ||
        post.title.toLowerCase().indexOf(searchQuery) > -1 ||
        post.excerpt.toLowerCase().indexOf(searchQuery) > -1 ||
        post.cat.toLowerCase().indexOf(searchQuery) > -1;
      return matchCat && matchQuery;
    });

    if (emptyMsg) {
      emptyMsg.classList.toggle('d-none', filtered.length > 0);
    }

    var visiblePosts = filtered.slice(0, displayedCount);
    gridEl.innerHTML = visiblePosts.map(function(post) {
      return '<div class="col-md-6 col-lg-4">' +
        '<article class="card h-100 hov">' +
        '<div class="overflow-hidden">' +
        '<a href="blog-details.html?id=' + post.id + '" class="d-block">' +
        '<img class="card-img-top" src="' + post.img + '" alt="' + post.title + '" loading="lazy">' +
        '</a>' +
        '</div>' +
        '<div class="card-body d-flex flex-column p-4">' +
        '<div class="d-flex justify-content-between align-items-center mb-2">' +
        '<span class="badge badge-gold">' + post.cat + '</span>' +
        '<span class="text-muted small">' + post.readTime + '</span>' +
        '</div>' +
        '<h5 class="mt-2 mb-3"><a href="blog-details.html?id=' + post.id + '" class="text-reset text-decoration-none">' + post.title + '</a></h5>' +
        '<p class="text-muted small flex-grow-1">' + post.excerpt + '</p>' +
        '<div class="d-flex justify-content-between align-items-center pt-3 border-top">' +
        '<small class="text-muted">' + post.date + '</small>' +
        '<a href="blog-details.html?id=' + post.id + '" class="fw-semibold small d-inline-flex align-items-center gap-1">Read article →</a>' +
        '</div>' +
        '</div>' +
        '</article>' +
        '</div>';
    }).join('');

    if (moreBtn) {
      moreBtn.style.display = filtered.length > displayedCount ? 'inline-block' : 'none';
    }
  }

  renderArticles();
})();