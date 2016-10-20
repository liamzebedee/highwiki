var React = require('react')
var ReactDOM = require('react-dom')

class HighwikiThing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			detailLevel: 0
		}
		this.showMore = this.showMore.bind(this)
		this.processLinks = this.processLinks.bind(this)
	}

	showMore() {
		this.setState({ detailLevel: this.state.detailLevel+1 })
	}

	componentDidMount() {
		this.processLinks()
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.detailLevel != this.state.detailLevel) {
			this.processLinks()
		}
	}

	processLinks() {
		makeThingsHighWiki($(INLINE_WIKI_ARTICLE_LINK, this.refs.excerpt));
	}

	render() {
		let $content = $('#mw-content-text', this.props.data).children('p')//.not('div');
		let excerpt;
		switch(this.state.detailLevel) {
			case 0:
				excerpt = $content.first().html();
				break;
			case 1:
				excerpt = $content.splice(0,3).map((el)=>el.outerHTML).join('')
			break;
		}

		return <span>
			<div ref="excerpt" dangerouslySetInnerHTML={{ __html: excerpt }}/>

			{ this.state.detailLevel == 0 ? 
				<span className='highwiki-showmore' onClick={this.showMore}>Show some more... ▼</span> 
				: <a className='highwiki-takeme' href={this.props.link} target='_blank'>Take me ↩</a> }
		</span>;
	}
}



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


	function getElIfWrappedInItalics($el) {
		let container = $el;
		if($el.parent().is('i')) container = $el.parent();
		return container
	}

	if(ALREADY_OPEN) {
		// Toggle close
		getElIfWrappedInItalics(el).next('.highwiki-excerpt').remove()

	} else {
		// Toggle open
		$.get(link, function(res){ 
			var content = $("<div class='highwiki-excerpt'></div>");
			getElIfWrappedInItalics(el).after(content);
			ReactDOM.render(<HighwikiThing link={link} shown={true} data={res}/>, content.get(0))
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
