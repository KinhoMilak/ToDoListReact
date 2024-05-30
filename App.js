import React, { useState } from 'react';
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
import CheckBox from '@react-native-community/checkbox';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTask = () => {
    if (title.length > 0 && description.length > 0) {
      setTasks([...tasks, { id: Math.random().toString(), title, description, completed: false }]);
      setTitle('');
      setDescription('');
      setIsAdding(false);
    }
  };

  const toggleCompletion = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <CheckBox
        value={item.completed}
        onValueChange={() => toggleCompletion(item.id)}
      />
      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
        <Text style={[styles.taskDescription, item.completed && styles.completedText]}>{item.description}</Text>
      </View>
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
});

export default App;
