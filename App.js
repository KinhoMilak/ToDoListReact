import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { createTable, fetchTasks, insertTask, updateTaskCompletion, deleteTask } from './SQL/dataBase';  

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    createTable();
    fetchTasks(setTasks);
  }, []);

  const addTask = () => {
    if (title.length > 0 && description.length > 0) {
      const newTask = { id: Math.random().toString(), title, description, completed: 0 };
      insertTask(newTask, () => {
        setTasks([...tasks, newTask]);
        setTitle('');
        setDescription('');
        setIsAdding(false);
      });
    }
  };

  const toggleCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const completed = task.completed ? 0 : 1;

    updateTaskCompletion(taskId, completed, () => {
      setTasks(tasks.map(task => task.id === taskId ? { ...task, completed } : task));
    });
  };

  const removeTask = (taskId) => {
    deleteTask(taskId, () => {
      setTasks(tasks.filter(task => task.id !== taskId));
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <CheckBox
        value={item.completed === 1}
        onValueChange={() => toggleCompletion(item.id)}
      />
      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskTitle, item.completed === 1 && styles.completedText]}>{item.title}</Text>
        <Text style={[styles.taskDescription, item.completed === 1 && styles.completedText]}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeTask(item.id)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isAdding ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Salvar" onPress={addTask} />
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Text style={styles.addButtonText}>+ Adicionar Tarefa</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 18,
  },
  taskDescription: {
    fontSize: 14,
    color: 'gray',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default App;
