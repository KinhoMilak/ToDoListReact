import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tasks.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, title TEXT, description TEXT, completed INTEGER);'
    );
  });
};

export const fetchTasks = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tasks;',
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      },
      (_, error) => {
        console.log('Erro ao acessar', error);
      }
    );
  });
};

export const insertTask = (task, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO tasks (id, title, description, completed) values (?, ?, ?, ?);',
      [task.id, task.title, task.description, task.completed],
      successCallback,
      (_, error) => {
        console.log('Erro ao inserir', error);
        errorCallback && errorCallback(error);
      }
    );
  });
};

export const updateTaskCompletion = (taskId, completed, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE tasks SET completed = ? WHERE id = ?;',
      [completed, taskId],
      successCallback,
      (_, error) => {
        console.log('Erro ao atualizar', error);
        errorCallback && errorCallback(error);
      }
    );
  });
};

export const deleteTask = (taskId, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM tasks WHERE id = ?;',
      [taskId],
      successCallback,
      (_, error) => {
        console.log('Error ao deletar', error);
        errorCallback && errorCallback(error);
      }
    );
  });
};
