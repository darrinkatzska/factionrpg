var data;
var timeout_id = 0;
var hold_time = 200;

$(document).ready(function(){
	
	$( "select" ).change(updateOutcome);
	$( "input" ).mousedown(function() {
		var buttonName = $(this).attr("id");
		updateNumbers(buttonName);
		timeout_id = setInterval(updateNumbers, hold_time, buttonName);
	}).bind('mouseup mouseleave touchend', function() {
		clearInterval(timeout_id);
	});

	data = loadData();

	updateDoS();
	updateInstead();
	updateOutcome();
});

function updateNumbers(buttonName) {

	if (buttonName == "mmx5e_check_up") {
		var oldVal = Number($( "#mmx5e_check" ).val());
		var newVal = oldVal + 1;
		$( "#mmx5e_check" ).val(newVal);
	} else if (buttonName == "mmx5e_check_down") {
		var oldVal = Number($( "#mmx5e_check" ).val());
		var newVal = Math.max(oldVal - 1, 1);
		$( "#mmx5e_check" ).val(newVal);		
	} else if (buttonName == "mmx5e_dc_up") {
		var oldVal = Number($( "#mmx5e_dc" ).val());
		var newVal = oldVal + 1;
		$( "#mmx5e_dc" ).val(newVal);		
	} else if (buttonName == "mmx5e_dc_down") {
		var oldVal = Number($( "#mmx5e_dc" ).val());
		var newVal = Math.max(oldVal - 1, 1);
		$( "#mmx5e_dc" ).val(newVal);		
	} 
	
	if (buttonName == "man_up") {
		var oldVal = Number($( "#academy_mans" ).val());
		var newVal = oldVal + 1;
		$( "#academy_mans" ).val(newVal);
	} else if (buttonName == "man_down") {
		var oldVal = Number($( "#academy_mans" ).val());
		var newVal = Math.max(oldVal - 1, 1);
		$( "#academy_mans" ).val(newVal);		
	} else if (buttonName == "token_up") {
		var oldVal = Number($( "#tokens" ).val());
		var newVal = oldVal + 1;
		$( "#tokens" ).val(newVal);		
	} else if (buttonName == "token_down") {
		var oldVal = Number($( "#tokens" ).val());
		var newVal = Math.max(oldVal - 1, 1);
		$( "#tokens" ).val(newVal);		
	} 

	if (buttonName == "diff_up") {
		var oldVal = Number($( "#difficulty" ).val());
		var newVal = oldVal + 1;
		$( "#difficulty" ).val(newVal);
	} else if (buttonName == "diff_down") {
		var oldVal = Number($( "#difficulty" ).val());
		var newVal = oldVal - 1;
		$( "#difficulty" ).val(newVal);		
	} else if (buttonName == "result_up") {
		var oldVal = Number($( "#result" ).val());
		var newVal = oldVal + 1;
		$( "#result" ).val(newVal);		
	} else if (buttonName == "result_down") {
		var oldVal = Number($( "#result" ).val());
		var newVal = oldVal - 1;
		$( "#result" ).val(newVal);		
	}
	
	updateDoS();
	updateInstead();
	updateOutcome();
}

function updateDoS() {

	var mmx5e_dos = "";
	
	var mmx5e_dc = $( "#mmx5e_dc" ).val();
	var mmx5e_check =  $( "#mmx5e_check" ).val();
	
	var difference = mmx5e_check - mmx5e_dc;
	var numSuccesses = Math.floor((difference) / 5) + 1;
	
	if (difference >= 0) {
		mmx5e_dos += "Success: " + numSuccesses + " DoS";
		$( "#mmx5e_dos" ).removeClass().addClass("success");
	} else {
		mmx5e_dos += "Failure: 0 DoS";
		$( "#mmx5e_dos" ).removeClass().addClass("fail_by_4");
	}
	
	$( "#mmx5e_dos" ).html(mmx5e_dos);
}

function updateInstead() {
	
	var instead = "";
	
	var mansValue = $( "#academy_mans" ).val();
	var tokensValue = $( "#tokens" ).val();
	
	var replacement = Math.pow(3, mansValue - 1) * tokensValue;
	
	$( "#instead" ).html(replacement + " of each");
}

function updateOutcome() {
	
	var outcome = "";
	
	var checkValue = $( "#check option:selected" ).val();
	var difficultyValue = $( "#difficulty" ).val();
	var resultValue =  $( "#result" ).val();
	
	var difference = resultValue - difficultyValue;
	var numSuccesses = Math.floor((difference + 5) / 5);
	
	if (checkValue == "attack") {
		
		$( "#diff_label" ).html("Dodge/Parry DC");
		$( "#result_label" ).html("Combat Check");
		
		if (difference >= 0) {
			
			if (numSuccesses == 1) {
				outcome += data["attack"][0];
			} else if (numSuccesses == 2) {
				outcome += data["attack"][1];
			} else {
				outcome += data["attack"][2];
			}
			
			$( "#outcome" ).removeClass().addClass("success");

		} else {
			outcome += "Miss";
			$( "#outcome" ).removeClass().addClass("fail_by_4");
		}
		
	} else if (checkValue == "skill") {
		
		$( "#diff_label" ).html("Skill DC");
		$( "#result_label" ).html("Skill Check");
		
		if (difference >= 0) {
			outcome += numSuccesses + " degrees of Success";
			$( "#outcome" ).removeClass().addClass("success");
		} else {
			outcome += ((numSuccesses - 1) * -1) + " degrees of Failure";
			$( "#outcome" ).removeClass().addClass("fail_by_4");
		}
	
	} else {
		
		$( "#diff_label" ).html("Power DC");
		$( "#result_label" ).html("Resistance Check");
		
		if (difference >= 5) {
			outcome += "Resisted";
			$( "#outcome" ).removeClass().addClass("success");
		} else {
			if (difference < 5 && difference >= 0){
				outcome += data[checkValue][0];
				$( "#outcome" ).removeClass().addClass("fail_by_1");
			} else if (difference < 0 && difference >= -5) {
				outcome += data[checkValue][1];
				$( "#outcome" ).removeClass().addClass("fail_by_2");
			} else if (difference < -5 && difference >= -10) {
				outcome += data[checkValue][2];	
				$( "#outcome" ).removeClass().addClass("fail_by_3");			
			} else if (difference < -10) {
				outcome += data[checkValue][3];
				$( "#outcome" ).removeClass().addClass("fail_by_4");
			}
		}
	}
	
	$( "#outcome" ).html(outcome);
}

function loadData() {
	
	var data = new Array();
	
	data["attack"] = new Array("Hit", "Hit + Multiattack DC+2", "Hit + Multiattack DC+5");
	data["damage"] = new Array("Injured", "Injured + Dazed", "Injured + Staggered", "Injured + Incapacitated");
	data["charm"] = new Array("Injured", "Injured + Entranced", "Injured + Compelled", "Injured + Controlled");
	data["exhaust"] = new Array("Injured", "Injured + Fatigued", "Injured + Exhausted", "Injured + Comatose");
	data["petrify"] = new Array("Injured", "Injured + Immobile", "Injured + Stunned", "Injured + Inert");
	data["weaken"] = new Array("Injured", "Injured + Trait -2", "Injured + Trait -5", "Injured + Trait Fails");
	
	return data;
}