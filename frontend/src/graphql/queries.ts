import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees($filter: EmployeeFilter, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
    employees(filter: $filter, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`; 