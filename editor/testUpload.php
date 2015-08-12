<?php
	$files = $_FILES['photos'];
	move_uploaded_file($_FILES['photos']['tmp_name'], $_FILES['photos']['name']);
	print_r($files);
?>