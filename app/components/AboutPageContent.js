'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Heart, Lightbulb, Users } from 'lucide-react';

export default function AboutPageContent() {
    const teamMembers = [
        {
            id: 1,
            name: 'Rupayan Dey',
            role: 'Founder & CEO',
            bio: 'Rupayan started this journey from her small workshop in Kolkata, driven by a passion for quality craftsmanship and a desire to bring unique products to the world.',
            imageUrl: 'https://placehold.co/400x400/a78bfa/ffffff?text=Rupayan',
        },
        {
            id: 2,
            name: 'Rupayan Dey',
            role: 'Head of Operations',
            bio: 'Rupayan ensures that every order is processed with care and that our logistics are as efficient and reliable as our products.',
            imageUrl: 'https://placehold.co/400x400/7c3aed/ffffff?text=Rupayan',
        },
        {
            id: 3,
            name: 'Rupayan Dey',
            role: 'Customer Happiness Lead',
            bio: 'Rupayan leads our support team with a simple mission: to ensure every customer feels valued and heard.',
            imageUrl: 'https://placehold.co/400x400/c4b5fd/ffffff?text=Rupayan',
        },
    ];

    return (
        <div className="bg-white">
            {/* --- Hero Section --- */}
            <div className="relative h-96 bg-gray-800">
                <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Our team working together"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Crafting Quality, Delivering Joy.</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl">
                        We believe that great products are more than just items—they're an experience. Welcome to our story.
                    </p>
                </div>
            </div>

            {/* --- Our Mission Section --- */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Our mission is to bring you a curated selection of high-quality products that blend timeless design with modern innovation. We are committed to sourcing the finest materials and partnering with skilled artisans to create items that you'll love for a lifetime. We don't just sell products; we deliver parcels of happiness to your doorstep.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <Image
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
                            alt="A person carefully packaging a product"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* --- Our Values Section --- */}
            <section className="bg-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">What We Stand For</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4"><Award size={32} className="text-indigo-600" /></div>
                            <h3 className="text-xl font-semibold text-gray-800">Uncompromising Quality</h3>
                            <p className="mt-2 text-gray-600">We obsess over every detail to ensure our products meet the highest standards.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4"><Heart size={32} className="text-indigo-600" /></div>
                            <h3 className="text-xl font-semibold text-gray-800">Customer Focus</h3>
                            <p className="mt-2 text-gray-600">You are at the heart of everything we do. Your satisfaction is our priority.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4"><Lightbulb size={32} className="text-indigo-600" /></div>
                            <h3 className="text-xl font-semibold text-gray-800">Constant Innovation</h3>
                            <p className="mt-2 text-gray-600">We are always exploring new ideas and designs to bring you the best.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4"><Users size={32} className="text-indigo-600" /></div>
                            <h3 className="text-xl font-semibold text-gray-800">Community Spirit</h3>
                            <p className="mt-2 text-gray-600">We're more than a store; we're a community of passionate individuals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Meet The Team Section --- */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="bg-white rounded-lg shadow-sm p-6 text-center">
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    width={150}
                                    height={150}
                                    className="mx-auto rounded-full mb-4"
                                    unoptimized={true}
                                />
                                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                                <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                                <p className="text-gray-600">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Call to Action Section --- */}
            <section className="bg-indigo-700">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to join our family?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        Explore our collection and find something that speaks to you.
                    </p>
                    <Link href="/products" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto">
                        Shop Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
