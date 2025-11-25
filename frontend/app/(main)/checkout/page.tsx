"use client";

import React, { Suspense } from 'react';
import CheckoutContent from './checkout-content';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
