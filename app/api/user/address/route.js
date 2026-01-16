import clientPromise from '@/app/lib/db';
import { getUserIdFromRequest } from '@/app/lib/auth';
import { validateObjectId } from '@/app/lib/utils';
import { ObjectId } from 'mongodb';

// -------------------- GET --------------------
export async function GET(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { addresses: 1 } }
    );

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return Response.json(
      (user.addresses || []).map(addr => ({
        ...addr,
        _id: addr._id.toString()
      }))
    );
  } catch (error) {
    console.log('GET error', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// -------------------- POST --------------------
export async function POST(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }
    );
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { street, city, state, postalCode, country, is_default, addressType } = await request.json();

    const newAddress = {
      _id: new ObjectId(),
      street,
      city,
      state,
      addressType,
      postalCode,
      country,
      is_default: !!is_default,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If this is default, unset others
    if (newAddress.is_default) {
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { "addresses.$[].is_default": false } }
      );
    }

    await db.collection('users').updateOne(
      { _id: user._id },
      { $push: { addresses: newAddress } }
    );

    return Response.json(
      { ...newAddress, _id: newAddress._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.log('POST error', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// -------------------- PUT --------------------
export async function PUT(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    const client = await clientPromise;
    const db = client.db();

    const { addressId, ...updateData } = await request.json();

    if (!validateObjectId(addressId)) {
      return Response.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    // If new default, unset others first
    if (updateData.isDefault) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId), "addresses._id": new ObjectId(addressId) },
      { $set: Object.fromEntries(
        Object.entries(updateData).map(([k, v]) => [`addresses.$.${k}`, v])
      ) }
    );

    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { addresses: 1 } }
    );

    const updatedAddress = updatedUser.addresses.find(
      a => a._id.toString() === addressId
    );

    return Response.json({ ...updatedAddress, _id: updatedAddress._id.toString() });
  } catch (error) {
    console.log('PUT error', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// -------------------- DELETE --------------------
export async function DELETE(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    const client = await clientPromise;
    const db = client.db();

    const { addressId } = await request.json();

    if (!validateObjectId(addressId)) {
      return Response.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { addresses: 1 } }
    );

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const address = user.addresses.find(a => a._id.toString() === addressId);
    if (!address) {
      return Response.json({ error: 'Address not found' }, { status: 404 });
    }

    // Delete the address
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { addresses: { _id: new ObjectId(addressId) } } }
    );

    // If it was default, set another as default
    if (address.isDefault) {
      const updatedUser = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { addresses: 1 } }
      );
      if (updatedUser.addresses.length > 0) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId), "addresses._id": updatedUser.addresses[0]._id },
          { $set: { "addresses.$.isDefault": true } }
        );
      }
    }

    return Response.json({ message: 'Address deleted successfully' }, { status: 200 });
  } catch (error) {
    console.log('DELETE error', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
