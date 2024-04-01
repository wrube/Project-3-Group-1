let tabs = document.querySelectorAll('[data-tab-target]')
let tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        let target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
        target.classList.add('active')

        // If the clicked tab is the one containing the map, invalidate the map size
        if (tab.dataset.tabTarget === '#pricing') {
            map1.invalidateSize();
        }
    })
})