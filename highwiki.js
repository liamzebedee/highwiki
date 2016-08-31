const WIKI_ARTICLE_LINK = '.mw-body a';
const INLINE_WIKI_ARTICLE_LINK = 'a';


function isAnAnchorLink(link) {
	return link.startsWith('#');
}
function isAWikiArticleLink(link) {
	return link.startsWith('/wiki/');
}

function singleClick(ev) {
	var el = $(ev.target);
	const link = el.attr('href');
	if(isAnAnchorLink(link) || !isAWikiArticleLink(link)) return false;

	ev.preventDefault();

	const ALREADY_OPEN = el.data('already-open') || false;

	if(ev.ctrlKey || ev.metaKey) {
		// Cmd+Click
		openInNewTab(link)
		return false;
	}

	if(ALREADY_OPEN) {
		// Toggle close
		el.next('.highwiki-excerpt').remove();

	} else {
		// Toggle open

		$.get(link, function(res){ 
			var paragraph = $('#mw-content-text p', res).first(); 
			var content = $("<div class='highwiki-excerpt'>"+paragraph.html()+"</div>");
		
			makeThingsHighWiki($(INLINE_WIKI_ARTICLE_LINK, content));
			el.after(content);
		});
	}

	// Toggle
	el.data('already-open', !ALREADY_OPEN);
}

function doubleClick(ev) {
	ev.preventDefault();

	var el = $(ev.target);
	const link = el.attr('href');

	openInNewTab(link)

	return false;
}

function openInNewTab(articleUrl) {
	window.open(articleUrl, '_blank');
}

function makeThingsHighWiki(el) {
	el.singleClick(singleClick)
	el.on('dblclick', doubleClick)
}

makeThingsHighWiki($(WIKI_ARTICLE_LINK));


