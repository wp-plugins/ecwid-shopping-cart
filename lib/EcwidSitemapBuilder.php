<?php

require_once dirname(__FILE__) . '/JSONStreamingParser/Listener.php';
require_once dirname(__FILE__) . '/JSONStreamingParser/Parser.php';


class EcwidSitemapBuilder implements JsonStreamingParser_Listener {
	var $_stack;
	var $_key;
	var $callback;
	var $base_url;
	var $api;
	var $type;

	public function __construct($base_url, $callback, $api) {
		$this->callback = $callback;
		$this->base_url = $base_url;
		$this->api = $api;
	}

	public function generate() {

		foreach (array('products', 'categories') as $type) {
			$this->type = $type;
			$stream = $this->api->get_method_response_stream($type);
			if (!is_null($stream)) {
				try {
					$parser = new JsonStreamingParser_Parser($stream, $this);
					$parser->parse();
				} catch (Exception $e) {
					fclose($stream);
					throw $e;
				}
			}
		}

		return true;
	}

	public function file_position($line, $char) {

	}

	public function start_document() {
		$this->_stack = array();

		$this->_key = null;
	}

	public function end_document() {
	}

	public function start_object() {
		array_push($this->_stack, array());
	}

	public function end_object() {
		$obj = array_pop($this->_stack);
		if (is_array($obj) && array_key_exists('id', $obj)) {
			$callback = $this->callback;
			$callback(
				$this->base_url . '#!/~/' . ($this->type == 'products' ? 'product' : 'category') . '/id=' . $obj['id'],
				$this->type == 'products' ? 0.6 : 0.5,
				'weekly'
			);
		}
	}

	public function start_array() {
	}

	public function end_array() {
	}

	public function key($key) {
		$this->_key = $key;
	}

	public function value($value) {
		if ($this->_key == 'id') {
			array_push($this->_stack, array('id' => $value));
		}
	}
}