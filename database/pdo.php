<?php

/**
 * the connection to the database containing all notes
 * @author djh
 */
class Connection
{
    /** An instance of PDO used to access and edit the mySQL database */
    public $pdo;

    /** default constructor that initializes $pdo */
    public function __construct()
    {
        $this->pdo = new PDO('mysql:server=localhost:8080;dbname=notes', 'root', '');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * finds all notes in the mySQL database and sorts them by edit/create date in descending order
     * 
     * @return notes stored in the database
     */
    public function getNotes()
    {
        $mySQL = "SELECT * FROM notes ORDER BY create_date DESC";
        $statement = $this->pdo->prepare($mySQL);

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * gets a specific note from the database by id (the primary key)
     * 
     * @param $id the id to be queried for
     * @return note in the table associated with the given id
     */
    public function getNoteById($id)
    {
        $mySQL = "SELECT * FROM notes WHERE id = :id";
        $statement = $this->pdo->prepare($mySQL);

        $statement->bindValue('id', $id);

        $statement->execute();

        return $statement->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * adds a note to the database
     * 
     * @param $note the note to be added to the database
     * @return result (success/failure) of the execution of the prepared statement
     */
    public function addNote($note)
    {
        $mySQL = "INSERT INTO notes (title, description, create_date) VALUES (:title, :description, :date)";
        $statement = $this->pdo->prepare($mySQL);

        $statement->bindValue('title', $note['title']);
        $statement->bindValue('description', $note['description']);
        $statement->bindValue('date', date('Y-m-d H:i:s'));

        return $statement->execute();
    }

    /**
     * updates an existing note in the database
     * 
     * @param $id the id of the existing note in the database
     * @param $note the new/updated content to be put in the existing note
     * @return result (success/failure) of the execution of the prepared statement
     */
    public function updateNote($id, $note)
    {
        $mySQL = "UPDATE notes SET title = :title, description = :description, create_date = :date WHERE id = :id";
        $statement = $this->pdo->prepare($mySQL);

        $statement->bindValue('id', $id);
        $statement->bindValue('title', $note['title']);
        $statement->bindValue('description', $note['description']);
        $statement->bindValue('date', date('Y-m-d H:i:s'));

        return $statement->execute();
    }

    /**
     * removes a note from the database by id
     * 
     * @param $id the id of the note to remove
     * @return result (success/failure) of the execution of the prepared statement
     */
    public function removeNote($id)
    {
        $mySQL = "DELETE FROM notes WHERE id = :id";
        $statement = $this->pdo->prepare($mySQL);

        $statement->bindValue('id', $id);

        return $statement->execute();
    }
}

/**
 * this return statement allows an instance of
 * Connection to be created by a require_once statement
 * instead of needing to use new(...)
 * 
 * @return connection
 */
return new Connection();