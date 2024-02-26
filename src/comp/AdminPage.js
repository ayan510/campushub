import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from './firebase';
import { Button, Header, Segment, Modal, Table, Input } from 'semantic-ui-react';

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudentName, setEditStudentName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editClass, setEditClass] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    });
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setEditStudentName(student.studentName);
    setEditPhone(student.phone);
    setEditClass(student.class);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editStudentName || !editPhone || !editClass) {
      return;
    }

    update(ref(db, `students/${selectedStudent.id}`), {
      studentName: editStudentName,
      phone: editPhone,
      class: editClass
    });
    setModalOpen(false);
  };

  const handleApprove = () => {
    if (selectedStudent) {
      update(ref(db, `students/${selectedStudent.id}`), { status: 'Approved' });
      setModalOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedStudent) {
      update(ref(db, `students/${selectedStudent.id}`), { status: 'Rejected' });
      setModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      remove(ref(db, `students/${selectedStudent.id}`));
      setModalOpen(false);
    }
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Student Applications</Header>
      <Segment>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Student Name</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Class</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {students.map(student => (
              <Table.Row key={student.id} onClick={() => handleStudentClick(student)}>
                <Table.Cell>{student.studentName}</Table.Cell>
                <Table.Cell>{student.phone}</Table.Cell>
                <Table.Cell>{student.class}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size='tiny' centered>
        <Modal.Header>Student Details</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label='Student Name'
            value={editStudentName}
            onChange={(e) => {
              setEditStudentName(e.target.value);
              setIsEditing(true);
            }}
          />
          <br />
          <Input
            fluid
            label='Phone'
            value={editPhone}
            onChange={(e) => {
              setEditPhone(e.target.value);
              setIsEditing(true);
            }}
          />
          <br />
          <Input
            fluid
            label='Class'
            value={editClass}
            onChange={(e) => {
              setEditClass(e.target.value);
              setIsEditing(true);
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          {!isEditing && (
            <Button color='blue' onClick={handleEdit}>Edit</Button>
          )}
          {isEditing && (
            <Button color='blue' onClick={handleSaveEdit}>Save</Button>
          )}
          <Button color='teal' onClick={handleApprove}>Approve</Button>
          <Button color='red' onClick={handleReject}>Reject</Button>
          <Button color='black' onClick={handleDelete}>Delete</Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AdminPage;
