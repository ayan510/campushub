import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from './firebase';
import { Button, Header, Segment, Modal, Table, Input, Icon } from 'semantic-ui-react';

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).flatMap(([userId, user]) =>
          Object.entries(user).map(([studentId, student]) => ({
            userId,
            studentId,
            ...student
          }))
        );
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    });
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setEditStudent({ ...student });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    if (!editStudent) {
      return;
    }

    update(ref(db, `students/${editStudent.userId}/${editStudent.studentId}`), editStudent);
    setIsEditing(false);
    setModalOpen(false);
  };

  const handleApprove = () => {
    if (selectedStudent) {
      update(ref(db, `students/${selectedStudent.userId}/${selectedStudent.studentId}`), { ...selectedStudent, status: 'Approved' });
      setModalOpen(false);
    }
  };

  const handlePending = () => {
    if (selectedStudent) {
      update(ref(db, `students/${selectedStudent.userId}/${selectedStudent.studentId}`), { ...selectedStudent, status: 'Pending' });
      setModalOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedStudent) {
      update(ref(db, `students/${selectedStudent.userId}/${selectedStudent.studentId}`), { ...selectedStudent, status: 'Rejected' });
      setModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      remove(ref(db, `students/${selectedStudent.userId}/${selectedStudent.studentId}`));
      setModalOpen(false);
    }
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Segment raised style={{ marginTop: '-1px', marginTop: '20px' }}>
        <Header as='h2' style={{ textAlign: 'center', color: 'teal' }}>Student Applications</Header>

        <Table celled unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Student Name</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Class</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {students.map(student => (
              <Table.Row key={student.studentId} onClick={() => handleStudentClick(student)}>
                <Table.Cell>{student.studentName}</Table.Cell>
                <Table.Cell>{student.phone}</Table.Cell>
                <Table.Cell>{student.class}</Table.Cell>
                <Table.Cell>{student.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size='tiny' centered>
          <Modal.Header>
            Student Details
            <Icon name='close' onClick={() => setModalOpen(false)} style={{ cursor: 'pointer', float: 'right' }} />
          </Modal.Header>
          <Modal.Content>
            {editStudent && (
              <div>
                <Input
                  fluid
                  label='Student Name'
                  value={editStudent.studentName}
                  onChange={(e) => setEditStudent({ ...editStudent, studentName: e.target.value })}
                  disabled={!isEditing}
                />
                <br />
                <Input
                  fluid
                  label='Phone'
                  value={editStudent.phone}
                  onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                  disabled={!isEditing}
                />
                <br />
                <Input
                  fluid
                  label='Class'
                  value={editStudent.class}
                  onChange={(e) => setEditStudent({ ...editStudent, class: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            )}
          </Modal.Content>
          <Modal.Actions>
            {!isEditing && (
              <Button color='blue' onClick={handleToggleEdit}>Edit</Button>
            )}
            {isEditing && (
              <Button color='blue' onClick={handleSaveEdit}>Save</Button>
            )}
            <Button color='green' onClick={handleApprove}>Approve</Button>
            <Button color='yellow' onClick={handlePending}>Pending</Button>
            <Button color='red' onClick={handleReject}>Reject</Button>
            <Button color='black' onClick={handleDelete}>Delete</Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    </div>
  );
};

export default AdminPage;

// BEST 1 WITH FUNCTIONALITY