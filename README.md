versatilegrid
=============

VersatileGrid is a responsive grid for Bootstrap which allows you to keep a nice look in your grids for mobile devices without loosing functionality.

## Installation

Add css files in the header section:

    <link href="your_css_path/bootstrap.min.css" rel="stylesheet">
	<link href="your_css_path/font-awesome.min.css" rel="stylesheet">
	<link href="your_css_path/versatileGrid.css" rel="stylesheet">

Add js at the bottom before close body tag:

    <script src="your_js_path/jquery-1.10.1.min.js" type="text/javascript" ></script>
    <script src="your_js_path/versatileGrid.js" type="text/javascript" ></script>
    <script src="your_js_path/bootstrap.min.js" type="text/javascript" ></script>
	
**bootstrap.min.js** file is optional, add it only if you are going to use functions or plugins from bootstrap, otherwise is no needed.	

## Basic Setup

If you are going to show static information, you can use the following HTML code. (This is default HTML for tables in Bootstrap):

    <table class="table" id="vgTable" data-title="Example Users" data-colsWidth="30" >
		<thead>
			<tr >
			<th >Id</th>
			<th >First name</th>
			<th >Last name</th>
			<th >Phone</th>
			<th >Username</th>
		</tr>	
		</thead>
		<tbody>
			<tr>
				<td>1</td>	
				<td>Mark</td>
				<td>This is a long long long long very very very long so long example text text text and text</td>
				<td>315-789-8038</td>
				<td>mSmith</td>
			</tr>
			<tr>
				<td >2</td>	
				<td>Sean</td>
				<td>Paterson</td>
				<td>315-232-1234</td>
				<td>sPat16</td>
			</tr>
		</tbody>
    </table>
	
###Run versatileGrid:

	$(function() {
		$("#vgTable").versatilGrid();
	});

If you want to apply versatilGrid to multiple grid on the fly, you can set different styles via attributes.	


Check out more [Demos and Documentation](http://kodemax.com/projects/versatilegrid/i)

