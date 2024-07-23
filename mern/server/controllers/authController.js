import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// descomentar para enviar email de verificacion
// export const registerWithEmailVerification = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     let user = await User.findOne({
//       email
//     });

//     if (user) {
//       return res.status(400).json({
//         message: 'User already exists'
//       });
//     }

//     user = new User({
//       name,
//       email,
//       password
//     });

//     await user.save();

//     const emailVerificationToken = user.getEmailVerificationToken();

//     await user.save({
//       validateBeforeSave: false
//     });

//     const emailVerificationURL = `${req.protocol}://${req.get('host')}/verify-email/${emailVerificationToken}`;

//     const message = `Click the link to verify your email: ${emailVerificationURL}`;

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: 'Email verification',
//         message
//       });

//       res.status(201).json({
//         message: 'Email sent'
//       });
//     } catch (error) {
//       console.error(error);

//       user.emailVerificationToken = undefined;
//       user.emailVerificationExpire = undefined;

//       await user.save({
//         validateBeforeSave: false
//       });

//       return res.status(500).json({
//         message: 'Email could not be sent'
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Server error'
//     });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

//     const user = await User.findOne({
//       emailVerificationToken,
//       emailVerificationExpire: {
//         $gt: Date.now()
//       }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpire = undefined;
//     user.isEmailVerified = true;

//     await user.save({
//       validateBeforeSave: false
//     });

//     res.json({
//       message: 'Email verified'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred during email verification' });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//** a function to return to the authContext so that i can manage all the userInfo, for example the id, or the name, or email, through all the application */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export default { register, login, me };