const LINK = '.mw-body a';

function makeKnowledgeFunky(ev){ 
	ev.preventDefault(); 
	var el = $(ev.target); 
	$.get(el.attr('href'), function(res){ 
		var paragraph = $('#mw-content-text p', res).first(); 
		var content = $("<div style='padding:1em;border:1px solid #ffe;'>"+paragraph.html()+"</div>");
		$('a', content).click(makeKnowledgeFunky);
		el.after(content);
	});
};

$(LINK).click(makeKnowledgeFunky)