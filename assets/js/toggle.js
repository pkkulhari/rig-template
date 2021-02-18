/*<--- Sidebar Menu or Navbar Menu Toggle --->*/
document.querySelectorAll('a.tree').forEach(function (e) {
    e.addEventListener('click', toggle);
});

function toggle() {
    if (document.querySelector('#sidebar').classList.contains('shrinked')) setTop(this); // Set top to ul.tree-menu-1 - [Shrinked]
    if (this.classList.contains('active')) {
        closeAll(this);
    } else {
        closeAll(this);
        this.classList.add('active');
        // Reset target's offset top - [Shrinked]
        if (document.querySelector('#sidebar').classList.contains('shrinked') && !document.querySelector('a.nav-settings').classList.contains('active')) {
            targetOffsetTop_find();
        }
    }
}

function closeAll(el) {
    el.closest('ul').querySelectorAll('a.tree').forEach(function (e) {
        if (e.classList.contains('active')) {
            e.classList.remove('active');
        }
    })
}

/*<--- Close a.nav-settings on body click event  --->*/
document.addEventListener('click', function (e) {
    if (e.target.closest('a.nav-settings')) return;
    document.querySelector('a.nav-settings').classList.remove('active');
})

/*<--- Close ul.tree-menu-1 on body click event  --->*/
document.addEventListener('click', function (e) {
    if (document.querySelector('#sidebar').classList.contains('shrinked')) {
        if (e.target.closest('a.tree')) return;
        document.querySelectorAll('a.tree').forEach(function (e) {
            if (e.classList.contains('active')) e.classList.remove('active');
        })
    }
})

/*<--- Sidebar Toggle  --->*/
document.querySelector('a.sidebar-toggle').addEventListener('click', function () {
    if (document.querySelector('#sidebar').classList.contains('shrinked')) {
        document.querySelector('#sidebar').classList.remove('shrinked');

        document.querySelector('#sidebar .logo .logoSVG').classList.add('show');
        document.querySelector('#sidebar .logo .logoSVG-sm').classList.remove('show');

        document.querySelector('#navbar').classList.remove('full-nav');
        document.querySelector('#sidebar').removeEventListener('scroll', scrollTarget);
        _setTop();
    } else {
        document.querySelector('#sidebar').classList.add('shrinked');

        document.querySelector('#sidebar .logo .logoSVG').classList.remove('show');
        document.querySelector('#sidebar .logo .logoSVG-sm').classList.add('show');

        document.querySelector('#navbar').classList.add('full-nav');
        _setTop();
        targetOffsetTop_find();
        document.querySelector('#sidebar').addEventListener('scroll', scrollTarget);        
    }

    document.getElementById('content-wrapper').classList.toggle('full');
    document.getElementById('footer').classList.toggle('full');
});

// Full content when navbar is shrinked
if(document.querySelector('#sidebar').classList.contains('shrinked')) {
    document.getElementById('content-wrapper').classList.add('full');
    document.getElementById('footer').classList.add('full');
}