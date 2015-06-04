function createTestFeature(){
	var feature = new OpenLayers.Format.WKT().read("POINT(1,2)");
	feature.attributes = {
		SEMS_CODE: "SEMS_CODE",
		NAME: "NAME",
		NOTE: "NOTE",
		ADDRESS: "ADDRESS",
		BOROUGH: "M",
		ZIP: "ZIP",
		PHONE: "PHONE",
		EMAIL: "EMAIL",
		WEBSITE: "http://WEBSITE",
		MEALS: "MEALS",
		INDOOR_OUTDOOR: "INDOOR_OUTDOOR",
		EXTENDED_DAY: "EXTENDED_DAY",
		SEATS: "SEATS",
		DAY_LENGTH: "DAY_LENGTH",
		PREK_TYPE: "PREK_TYPE"
	};
	return feature;
};

var TEST_LIST = new nyc.upk.List();

QUnit.test("nyc.upk.FieldsDecorator.code", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.code(), "SEMS_CODE", "feature.code() should be 'SEMS_CODE'");	
});

QUnit.test("nyc.upk.FieldsDecorator.name", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.name(), "NAME", "feature.name() should be 'NAME'");	
});

QUnit.test("nyc.upk.FieldsDecorator.note", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.note(), "NOTE", "feature.note() should be 'NOTE'");	
});

QUnit.test("nyc.upk.FieldsDecorator.address1", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.address1(), "ADDRESS", "feature.address1() should be 'ADDRESS'");	
});

QUnit.test("nyc.upk.FieldsDecorator.address2", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.address2(), "Manhattan, NY ZIP", "feature.address2() should be 'Manhattan, NY ZIP'");
	feature.attributes.BOROUGH = "X",
	assert.equal(feature.address2(), "Bronx, NY ZIP", "feature.address2() should be 'Bronx, NY ZIP'");	
	feature.attributes.BOROUGH = "K",
	assert.equal(feature.address2(), "Brooklyn, NY ZIP", "feature.address2() should be 'Brooklyn, NY ZIP'");	
	feature.attributes.BOROUGH = "Q",
	assert.equal(feature.address2(), "Queens, NY ZIP", "feature.address2() should be 'Queens, NY ZIP'");	
	feature.attributes.BOROUGH = "R",
	assert.equal(feature.address2(), "Staten Island, NY ZIP", "feature.address2() should be 'Staten Island, NY ZIP'");	
});

QUnit.test("nyc.upk.FieldsDecorator.phone", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.phone(), "PHONE", "feature.phone() should be 'PHONE'");	
	feature.attributes.PHONE = null;
	assert.equal(feature.phone(), "", "feature.phone() should be ''");	
});

QUnit.test("nyc.upk.FieldsDecorator.email", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.email(), "EMAIL", "feature.email() should be 'EMAIL'");	
	feature.attributes.EMAIL = null;
	assert.equal(feature.email(), "", "feature.email() should be ''");	
});

QUnit.test("nyc.upk.FieldsDecorator.web", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.web(), "http://WEBSITE", "feature.web() should be 'http://WEBSITE'");	
	feature.attributes.WEBSITE = null;
	assert.equal(feature.web(), "", "feature.web() should be ''");	
});

QUnit.test("nyc.upk.FieldsDecorator.meal", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.meal(), "MEALS", "feature.meal() should be 'MEALS'");	
});

QUnit.test("nyc.upk.FieldsDecorator.inout", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.inout(), "INDOOR_OUTDOOR", "feature.inout() should be 'INDOOR_OUTDOOR'");	
});

QUnit.test("nyc.upk.FieldsDecorator.seats", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.seats(), "SEATS", "feature.seats() should be 'SEATS'");	
});

QUnit.test("nyc.upk.FieldsDecorator.dayLength", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.dayLength(), "DAY_LENGTH", "feature.dayLength() should be 'DAY_LENGTH'");	
});

QUnit.test("nyc.upk.FieldsDecorator.type", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	assert.equal(feature.type(), "PREK_TYPE", "feature.type() should be 'PREK_TYPE'");	
});

QUnit.test("nyc.upk.FieldsDecorator.isFullDay", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	feature.attributes.DAY_LENGTH = 1;
	assert.ok(feature.isFullDay(), "feature.isFullDay() should be 'true'");	
	feature.attributes.DAY_LENGTH = 2;
	assert.ok(feature.isFullDay(), "feature.isFullDay() should be 'true'");
	feature.attributes.DAY_LENGTH = 3;
	assert.notOk(feature.isFullDay(), "feature.isFullDay() should be 'false'");	
	feature.attributes.DAY_LENGTH = 4;
	assert.notOk(feature.isFullDay(), "feature.isFullDay() should be 'false'");	
	feature.attributes.DAY_LENGTH = 5;
	assert.ok(feature.isFullDay(), "feature.isFullDay() should be 'true'");	
	feature.attributes.DAY_LENGTH = 6;
	assert.notOk(feature.isFullDay(), "feature.isFullDay() should be 'false'");		
	feature.attributes.DAY_LENGTH = 7;
	assert.ok(feature.isFullDay(), "feature.isFullDay() should be 'true'");	
});

QUnit.test("nyc.upk.HtmlDecorator.codeHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	var node = feature.codeHtml();
	var child1 = node.children().first();
	var child2 = node.children().last();
	assert.equal(node[0].tagName, "DIV", "codeHtml node should be a <div>");	
	assert.ok(node.hasClass("code"), "codeHtml node should have css class 'code'");	
	assert.ok(child1.hasClass("name"), "codeHtml node first child node should have css class 'name'");	
	assert.equal(child1[0].tagName, "SPAN", "codeHtml node first child node should be a <span>");	
	assert.equal(child1.html(), "Program Code: ", "codeHtml node first child node html should be 'Program Code: '");	
	assert.equal(child2[0].tagName, "SPAN", "codeHtml node last child node should be a <span>");	
	assert.ok(child2.hasClass("notranslate"), "codeHtml node last child node should have css class 'notranslate'");	
	assert.equal(child2.html(), "SEMS_CODE", "codeHtml last child node html should be 'SEMS_CODE'");		
});

QUnit.test("nyc.upk.HtmlDecorator.nameHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	var node = feature.nameHtml();
	var child1 = node.children().first();
	assert.equal(node[0].tagName, "DIV", "nameHtml node should be a <div>");	
	assert.ok(node.hasClass("name"), "nameHtml node should have css class 'name'");
	assert.ok(node.hasClass("notranslate"), "nameHtml node should have css class 'notranslate'");
	assert.ok(child1.hasClass("type-icon"), "nameHtml node first child node should have css class 'type-icon'");	
	assert.equal(child1[0].tagName, "IMG", "nameHtml node first child node should be a <img>");	
	assert.equal(child1.attr("src"), "img/PREK_TYPE0.png", "nameHtml node first child node src attr should be 'img/PREK_TYPE0.png'");	
	child1.remove();
	assert.equal(node.html(), "NAME", "nameHtml node html should be 'NAME'");	
});

QUnit.test("nyc.upk.HtmlDecorator.noteHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	var node = feature.noteHtml();
	assert.equal(node[0].tagName, "DIV", "noteHtml node should be a <div>");	
	assert.ok(node.hasClass("note"), "noteHtml node should have css class 'note'");
	assert.equal(node.html(), "NOTE", "noteHtml node html should be 'NOTE'");	
});

QUnit.test("nyc.upk.HtmlDecorator.addrHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	var addr1 = feature.addrHtml()[0];
	var addr2 = feature.addrHtml()[1];
	assert.equal(addr1[0].tagName, "DIV", "addrHtml node one should be a <div>");	
	assert.equal(addr2[0].tagName, "DIV", "addrHtml node two should be a <div>");	
	assert.ok(addr1.hasClass("addr"), "addrHtml node one should have css class 'addr'");
	assert.ok(addr2.hasClass("addr"), "addrHtml node two should have css class 'addr'");
	assert.ok(addr1.hasClass("notranslate"), "addrHtml node one should have css class 'notranslate'");
	assert.ok(addr2.hasClass("notranslate"), "addrHtml node two should have css class 'notranslate'");
	assert.equal(addr1.html(), feature.address1(), "addrHtml node one html should be '" + feature.address1() + "'");	
	assert.equal(addr2.html(), feature.address2(), "addrHtml node two html should be '" + feature.address2() + "'");	
});

QUnit.test("nyc.upk.HtmlDecorator.phoneHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);

	IOS = false;
	var node = feature.phoneHtml();
	var link = node.children().first();
	assert.equal(node[0].tagName, "DIV", "phoneHtml node should be a <div>");	
	assert.equal(link[0].tagName, "A", "phoneHtml node first child node should be an <a>");	
	assert.notOk(link.attr("target"), "phoneHtml link should not have a target attrwhen IOS=false");	
	assert.equal(link.attr("href"), "tel:PHONE", "phoneHtml link href should be 'tel:PHONE'");	
	assert.equal(link.html(), "PHONE", "phoneHtml link html should be 'PHONE'");	

	IOS = true;
	var node = feature.phoneHtml();
	var link = node.children().first();
	assert.equal(link.attr("target"), "_blank", "phoneHtml link should have a target='_blank' attr when IOS=true");	
});

QUnit.test("nyc.upk.HtmlDecorator.emailHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);

	IOS = false;
	var node = feature.emailHtml();
	var link = node.children().first();
	assert.equal(node[0].tagName, "DIV", "emailHtml node should be a <div>");	
	assert.equal(link[0].tagName, "A", "emailHtml node first child node should be an <a>");	
	assert.notOk(link.attr("target"), "emailHtml link should not have a target attrwhen IOS=false");	
	assert.equal(link.attr("href"), "mailto:EMAIL", "emailHtml link href should be 'mailto:EMAIL'");	
	assert.equal(link.html(), "EMAIL", "emailHtml link html should be 'EMAIL'");	

	IOS = true;
	var node = feature.emailHtml();
	var link = node.children().first();
	assert.equal(link.attr("target"), "_blank", "emailHtml link should have a target='_blank' attr when IOS=true");	
});

QUnit.test("nyc.upk.HtmlDecorator.webHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);

	IOS = false;
	var node = feature.webHtml();
	var link = node.children().first();
	assert.equal(node[0].tagName, "DIV", "webHtml node should be a <div>");	
	assert.equal(link[0].tagName, "A", "webHtml node first child node should be an <a>");	
	assert.equal(link.attr("target"), "_blank", "webHtml link should have a target='_blank' attr when IOS=false");	
	assert.equal(link.attr("href"), "http://WEBSITE", "webHtml link href should be 'http://WEBSITE'");	
	assert.equal(link.html(), "WEBSITE", "webHtml link html should be 'WEBSITE'");	

	IOS = true;
	var node = feature.webHtml();
	var link = node.children().first();
	assert.equal(link.attr("target"), "_blank", "webHtml link should have a target='_blank' attr when IOS=true");	
});

QUnit.test("nyc.upk.HtmlDecorator.programFeatureHtml MEAL", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	for (var i = 1; i < 9; i++){
		feature.attributes.MEALS = i;
		var node = feature.programFeatureHtml("meal", MEAL);
		assert.equal(node[0].tagName, "LI", "programFeatureHtml node should be an <li>");	
		assert.equal(node.html(), MEAL[i], "programFeatureHtml should have added list item '" + MEAL[i] + "'");			
	}
});

QUnit.test("nyc.upk.HtmlDecorator.programFeatureHtml IN_OUT", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	for (var i = 1; i < 10; i++){
		feature.attributes.INDOOR_OUTDOOR = i;
		var node = feature.programFeatureHtml("inout", IN_OUT);
		assert.equal(node[0].tagName, "LI", "programFeatureHtml node should be an <li>");	
		assert.equal(node.html(), IN_OUT[i], "programFeatureHtml should have added list item '" + IN_OUT[i] + "'");			
	}
});

QUnit.test("nyc.upk.HtmlDecorator.programFeatureHtml EXTEND", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	for (var i = 1; i < 4; i++){
		feature.attributes.EXTENDED_DAY = i;
		var node = feature.programFeatureHtml("extend", EXTEND);
		assert.equal(node[0].tagName, "LI", "programFeatureHtml node should be an <li>");	
		assert.equal(node.html(), EXTEND[i], "programFeatureHtml should have added list item '" + EXTEND[i] + "'");			
	}
});

QUnit.test("nyc.upk.HtmlDecorator.programFeaturesHtml", function(assert){
	var feature = createTestFeature();
	feature.attributes.MEALS = 1;
	feature.attributes.INDOOR_OUTDOOR = 2;
	feature.attributes.EXTENDED_DAY = 3;
	TEST_LIST.populate([feature]);
	var nodes = feature.programFeaturesHtml();
	var node1 = nodes[0];
	var node2 = nodes[1];
	assert.equal(node1[0].tagName, "DIV", "programFeatureHtml node should be a <div>");	
	assert.ok(node1.hasClass("name"), "programFeaturesHtml node one should have css class 'name'");
	assert.equal(node1.html(), "Program Features:", "programFeaturesHtml node one html should be 'Program Features:'");	
	assert.equal(node2[0].tagName, "UL", "programFeatureHtml node two should be a <ul>");	
	assert.equal(node2.children().length, 3, "programFeatureHtml node two should have 3 children");	
	assert.equal($(node2.children()[0]).html(),  MEAL[1], "programFeatureHtml node two first child html should be '" + MEAL[1] + "'");	
	assert.equal($(node2.children()[1]).html(),  IN_OUT[2], "programFeatureHtml node two secod child html should be '" + IN_OUT[2] + "'");	
	assert.equal($(node2.children()[2]).html(),  EXTEND[3], "programFeatureHtml node two third child html should be '" + EXTEND[3] + "'");	
});

QUnit.test("nyc.upk.HtmlDecorator.seatsDayHtml", function(assert){
	var feature = createTestFeature();
	TEST_LIST.populate([feature]);
	var node = feature.seatsDayHtml();
	console.warn(node);
	var child1 = node.children().first();
	assert.equal(node[0].tagName, "DIV", "seatsDayHtml node should be a <div>");	
	assert.ok(node.hasClass("seats"), "seatsDayHtml node should have css class 'seats'");
	assert.equal(child1[0].tagName, "SPAN", "seatsDayHtml node one should be a <span>");	
	assert.ok(child1.hasClass("name"), "seatsDayHtml node one should have css class 'name'");
	assert.equal(child1.html(), window.SCHOOL_YEAR + " Seats: ", "seatsDayHtml node one html should be '" + window.SCHOOL_YEAR + " Seats: " + "'");	
	
	for (var i = 1; i < 8; i++){
		feature.attributes.DAY_LENGTH = i;
		node = feature.seatsDayHtml();
		node.children().first().remove();
		assert.equal(node.html(), "SEATS " + window.DAY_LENGTH[i], "seatsDayHtml node html should be 'SEATS " + window.DAY_LENGTH[i] + "'");			
	}
});

