isByte=true;
_chBytes=2;
errCharLength='文字超長(/a個字符，中文占/c位)';
errNumLength='數字超長(/i位整數，/f位小數)';

test('数字：2整数,3小数。Success', function() {
	equal(undefined, checkColLength(3.5,'2.3'));		//1
	equal(undefined, checkColLength('3.5','2.3'));		//2
	equal(undefined, checkColLength('3.0','2.3'));		//3
	equal(undefined, checkColLength('3.','2.3'));		//4
	equal(undefined, checkColLength('0.5','2.3'));		//5
	equal(undefined, checkColLength('.5','2.3'));		//6
	equal(undefined, checkColLength(0.3,'2.3'));		//7
	equal(undefined, checkColLength('31.511','2.3'));	//8
	equal(undefined, checkColLength('3.511','2.3'));	//9
	equal(undefined, checkColLength('32','2.3'));		//10
	equal(undefined, checkColLength('99.','2.3'));		//11
	equal(undefined, checkColLength('.999','2.3'));		//12
});
test('数字：2整数,3小数。Fail', function() {
	equal('數字超長(2位整數，3位小數)', checkColLength(3.5111,'2.3'));			//1
	equal('數字超長(2位整數，3位小數)', checkColLength('3.5111','2.3'));		//2
	equal('數字超長(2位整數，3位小數)', checkColLength('311.0','2.3'));		//3
	equal('數字超長(2位整數，3位小數)', checkColLength('311.','2.3'));			//4
	equal('數字超長(2位整數，3位小數)', checkColLength('0.5111','2.3'));		//5
	equal('數字超長(2位整數，3位小數)', checkColLength('.51111','2.3'));		//6
	equal('數字超長(2位整數，3位小數)', checkColLength(0.31111,'2.3'));		//7
	equal('數字超長(2位整數，3位小數)', checkColLength('311.5111','2.3'));		//8
	equal('數字超長(2位整數，3位小數)', checkColLength('3.51111','2.3'));		//9
	equal('數字超長(2位整數，3位小數)', checkColLength('321','2.3'));			//10
	equal('數字超長(2位整數，3位小數)', checkColLength('991.','2.3'));			//11
	equal('數字超長(2位整數，3位小數)', checkColLength('.9991','2.3'));		//12
});
test('数字：3整数,0小数。Success', function() {
	equal(undefined, checkColLength(3,'3.0'));			//1
	equal(undefined, checkColLength('3','3.0'));		//2
	equal(undefined, checkColLength('30','3.0'));		//3
	equal(undefined, checkColLength('3.','3.0'));		//4
	equal(undefined, checkColLength('0','3.0'));		//5
	equal(undefined, checkColLength('111','3.0'));		//6
	equal(undefined, checkColLength(111,'3.0'));		//7
});
test('数字：數字超長(3位整數，0位小數)。Fail', function() {
	equal('數字超長(3位整數，0位小數)', checkColLength(3.5111,'3.0'));			//1
	equal('數字超長(3位整數，0位小數)', checkColLength('3.1','3.0'));			//2
	equal('數字超長(3位整數，0位小數)', checkColLength('311.0','3.0'));		//3
	equal('數字超長(3位整數，0位小數)', checkColLength('311.1','3.0'));		//4
	equal('數字超長(3位整數，0位小數)', checkColLength('0.5111','3.0'));		//5
	equal('數字超長(3位整數，0位小數)', checkColLength('.51111','3.0'));		//6
	equal('數字超長(3位整數，0位小數)', checkColLength(0.31111,'3.0'));		//7
	equal('數字超長(3位整數，0位小數)', checkColLength('3111.5111','3.0'));	//8
	equal('數字超長(3位整數，0位小數)', checkColLength('3.51111','3.0'));		//9
	equal('數字超長(3位整數，0位小數)', checkColLength('3211','3.0'));			//10
	equal('數字超長(3位整數，0位小數)', checkColLength('9911.','3.0'));		//11
	equal('數字超長(3位整數，0位小數)', checkColLength('.1','3.0'));			//12
});
test('文字：2個字符，中文占2位。Success', function() {
	equal(undefined, checkColLength('a','2'));			//1
	equal(undefined, checkColLength('','2'));			//2
	equal(undefined, checkColLength('a1','2'));			//3
	equal(undefined, checkColLength('zz','2'));			//4
	equal(undefined, checkColLength('我','2'));			//5
	equal(undefined, checkColLength(10,'2'));			//6
});
test('文字：2個字符，中文占2位。Fail', function() {
	equal('文字超長(2個字符，中文占2位)', checkColLength('aaa','2'));			//1
	equal('文字超長(2個字符，中文占2位)', checkColLength(111,'2'));			//2
	equal('文字超長(2個字符，中文占2位)', checkColLength('我的','2'));		//3
	equal('文字超長(2個字符，中文占2位)', checkColLength('a我','2'));			//4
});
test('文字：3個字符，中文占1位。Fail', function() {
	isByte=false;
	_chBytes=3;
	equal('文字超長(3個字符，中文占1位)', checkColLength('aaa1','3'));			//1
	equal('文字超長(3個字符，中文占1位)', checkColLength(1111,'3'));			//2
	equal('文字超長(3個字符，中文占1位)', checkColLength('我的11','3'));		//3
	equal('文字超長(3個字符，中文占1位)', checkColLength('a我11','3'));			//4
});
test('文字：3個字符，中文占1位。Success', function() {
	isByte=false;
	_chBytes=3;
	equal(undefined, checkColLength('aaa','3'));			//1
	equal(undefined, checkColLength(111,'3'));			//2
	equal(undefined, checkColLength('我的他','3'));		//3
	equal(undefined, checkColLength('我11','3'));			//4
});