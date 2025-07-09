import React from 'react';
import EmailComposer from '../../components/EmailComposer';
import { useContacts } from "../../hooks/useContacts";

export default function ContactsPage() {
  const { data: contacts } = useContacts();

  return (
    <div>
      {/* Existing contacts list/table */}
      {/* <ContactsTable contacts={contacts} /> */}

      {/* Your AI Email Composer */}
      <EmailComposer />
    </div>
  );
}