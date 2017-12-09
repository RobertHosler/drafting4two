<?php
 
require 'vendor/autoload.php';
 
use PostgreSQLTutorial\Connection as Connection;
use PostgreSQLTutorial\PostgreSQLCreateTable as PostgreSQLCreateTable;
 
try {
    
    // connect to the PostgreSQL database
    $pdo = Connection::get()->connect();
    
    // 
    $tableCreator = new PostgreSQLCreateTable($pdo);
    
    // create tables and query the table from the
    // database
    $tables = $tableCreator->createTables()
                            ->getTables();
    
    foreach ($tables as $table){
        echo $table . '<br>';
    }
    
} catch (\PDOException $e) {
    echo $e->getMessage();
}

?>