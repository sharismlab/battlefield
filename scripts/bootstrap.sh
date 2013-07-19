#! /usr/bin/env bash

bye() {
    unset BTF_HOME
    unset LEIN_HOME

    if [ -n "$_OLD_PS1" ] ; then
        PS1="$_OLD_PS1"
        export PS1
        unset _OLD_PS1
    fi

    if [ ! "$1" = "nondestructive" ] ; then
    # Self destruct!
        unset -f bye
    fi
}

# unset irrelevant variables
bye nondestructive

BTF_HOME=$(dirname ${BASH_SOURCE[0]})

# handles synbolic link
if [ -h "$BTF_HOME" ]; then
    while [ -h "$BTF_HOME" ]; do
        BTF_HOME=$(readlink -m "$BTF_HOME")
    done
fi

# convert to absolute path
pushd . > /dev/null
cd "$(dirname ${BTF_HOME})" > /dev/null
BTF_HOME=$(pwd)
popd > /dev/null

# handles synbolic link
if [ -h "$BTF_HOME" ]; then
    while [ -h "$BTF_HOME" ]; do
        BTF_HOME=$(readlink -m "$BTF_HOME")
    done
fi

export BTF_HOME
export PATH="$BTF_HOME/bin:$PATH"

_OLD_PS1="$PS1"
if [ "x" != x ] ; then
    PS1="$PS1"
    PS1="(btf)$PS1"
else
    PS1="(btf)$PS1"
fi
export PS1

# This should detect bash and zsh, which have a hash command that must
# be called to get it to forget past commands.  Without forgetting
# past commands the $PATH changes we made may not be respected
if [ -n "$BASH" -o -n "$ZSH_VERSION" ] ; then
    hash -r 2>/dev/null
fi
